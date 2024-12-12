import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { startOfWeek, endOfWeek, format } from "date-fns";
import PredictionPopup from "../predictionPopup";
import SuccessModal from "../success-failure-models/SuccessModal";
import FailureModal from "../success-failure-models/FailureModal";
import { getMyPredictions } from "../../API/ServerApi";

const MyPredictionsMain = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
    const [failureMessage, setFailureMessage] = useState<string>("");
    const [myPredictions, setMyPredictions] = useState<any[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    interface TeamNameProps {
        name: string;
    }
    const TeamName: React.FC<TeamNameProps> = ({ name }) => {
        if (name.length > 15) {
            const [firstPart, secondPart, ...restParts] = name.split(" ");

            if (restParts.length > 0) {
                return (
                    <>
                        {firstPart} {secondPart} <br /> {restParts.join(" ")}
                    </>
                );
            } else {
                return (
                    <>
                        {firstPart} <br /> {secondPart || ""}
                    </>
                );
            }
        }
        return <>{name}</>;
    };
    const getMyPreds = async () => {
        setIsLoading(true);
        try {
            const response = await getMyPredictions();
            if (!response || !response.success) {
                setIsError(true);
                return;
            }
            setMyPredictions(response.predictions);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const groupGamesByWeek = () => {
        const grouped: { [key: string]: any[] } = {};
        myPredictions.forEach((pred) => {
            pred.matches.forEach((game: any) => {
                const gameDate = new Date(game.date);
                const weekStart = startOfWeek(gameDate, { weekStartsOn: 1 }); // Week starts on Monday
                const weekEnd = endOfWeek(gameDate, { weekStartsOn: 1 });
                const weekKey = ${format(weekStart, "MMMM dd")} - ${format(weekEnd, "MMMM dd")};

                if (!grouped[weekKey]) {
                    grouped[weekKey] = [];
                }
                grouped[weekKey].push(game);
            });
        });
        return grouped;
    };

    useEffect(() => {
        getMyPreds();
    }, []);

    useEffect(() => {
        setProgress(
            myPredictions.length > 0
                ? Math.round(
                    (myPredictions.reduce(
                        (acc, pred) => acc + pred.matches.filter((game: any) => game.status?.short === "FT" || game.status?.short === "Completed").length,
                        0
                    ) /
                        myPredictions.reduce((acc, pred) => acc + pred.matches.length, 0)) *
                    100
                )
                : 0
        );
    }, [myPredictions]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span>{t("somethingWrong")}</span>
            </div>
        );
    }

    if (!myPredictions.length) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
                <span>{t("NoPredictionsYet")}</span>
                <button
                    className="p-3 rounded-lg text-xl bg-[#056A4C] text-white mt-4"
                    onClick={() => setIsPopupOpen(true)}
                >
                    {t("predictionPage")}
                </button>
                {isPopupOpen && <PredictionPopup handleClosePopup={() => setIsPopupOpen(false)} />}
            </div>
        );
    }

    const groupedGames = groupGamesByWeek();

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-2xl font-bold mb-4">{t("MyPredictions")}</h1>

            <div className="w-full max-w-5xl">
                <div className="grid grid-cols-3 gap-4 text-center border-b pb-4 mb-4 font-semibold">
                    <div>{t('MatchHistory')}</div>
                    <div>{t('MyPrediction')}</div>
                    <div>{t('My results')}</div>
                </div>

                <div className="grid grid-cols-3">

                    {Object.entries(groupedGames).map(([weekRange, games]) => (
                        <div key={weekRange} className="mb-8 col-span-2">
                            <h2 className="text-xl font-semibold mb-4">{weekRange}</h2>
                            {games.map((game: any, index: number) =>{ 
                                
                                return (
                                <div
                                    key={index}
                                    className="grid grid-cols-3 gap-4 items-center text-center border-b py-4 "
                                >
                                    {/* First Column: Match History */}
                                    <div className="grid grid-cols-4">
                                        <div className="col-start-1 col-end-4">
                                            <div className="flex justify-between items-center gap-auto mr-[20px]">
                                                <img
                                                    src={game.home_team.logo}
                                                    alt={`${game.home_team.name} logo`}
                                                    className="w-7 h-7"
                                                />
                                                <span className="text-sm">
                                                    <TeamName name={game.home_team.name} />
                                                </span>
                                                <span>-</span>
                                                <span className="text-sm">
                                                    <TeamName name={game.away_team.name} />
                                                </span>
                                                <img
                                                    src={game.away_team.logo}
                                                    alt={`${game.away_team.name} logo`}
                                                    className="w-7 h-7"
                                                />

                                            </div>

                                            <span className="text-xs text-gray-600">
                                                {game.goals?.home != null && game.goals?.away != null
                                                    ? ${game.goals.home}-${game.goals.away}
                                                    : t("NotPlayed")}
                                            </span>
                                        </div>
                                        <span className={`text-center text-xs font-bold rounded items-center w-[30px] h-[30px] ${game.goals?.home > game.goals?.away
                                            ? "bg-orange-500 text-white"
                                            : game.goals?.home < game.goals?.away
                                                ? "bg-white"
                                                : "bg-gray-200"}`}>
                                            {game.goals?.home !== null && game.goals?.away !== null
                                                ? game.goals.home > game.goals.away
                                                    ? "1"
                                                    : game.goals.home < game.goals.away
                                                        ? "2"
                                                        : "X"
                                                : ""}
                                        </span>

                                    </div>

                                    {/* Second Column: My Prediction */}
                                    <div>
                                        <div className="flex justify-center items-center gap-2">
                                            <span
                                                className={`text-sm p-2 border rounded ${game.choice === "1"
                                                    ? "bg-orange-500 text-white"
                                                    : game.choice === "x"
                                                        ? "bg-white"
                                                        : game.choice === "2"
                                                            ? "bg-red-200"
                                                            : "bg-gray-200"
                                                    }`}
                                            >
                                                {game.choice ? t(game.choice.toUpperCase()) : t("No Choice")}
                                            </span>
                                        </div>
                                    </div>

                               
                                <div>
                                    {game}
                                </div>
                                </div>
                           ) })}
                        </div>
                    ))}


                    <div className="grid grid-cols-2">
                       
                        <div className="grid max-h-[300px] grid-cols-1  gap-4 p-4   bg-white z-10 rounded-lg ">
                            <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                <p className="font-bold text-lg text-gray-700">Pool1</p>
                                <p className="text-sm text-gray-500">0 tokens</p>
                            </div>
                            <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                <p className="font-bold text-lg text-gray-700">Pool2</p>
                                <p className="text-sm text-gray-500">0 tokens</p>
                            </div>
                            <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                <p className="font-bold text-lg text-gray-700">Pool3</p>
                                <p className="text-sm text-gray-500">0 tokens</p>
                            </div>
                        </div>

                    </div>


                </div>


            </div>




            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
            <FailureModal
                isOpen={showFailureModal}
                onClose={() => setShowFailureModal(false)}
                failureMessage={failureMessage}
            />
            {isPopupOpen && <PredictionPopup handleClosePopup={() => setIsPopupOpen(false)} />}
        </div>
    );
};

export default MyPredictionsMain;