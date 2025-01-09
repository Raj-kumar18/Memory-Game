import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [solved, setSolved] = useState([]);
    const [win, setWin] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [chances, setChances] = useState(10);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleGridSize = (e) => {
        const size = parseInt(e.target.value);
        if (size >= 2 && size <= 10) setGridSize(size);
    };

    const handleChances = (e) => {
        const chance = parseInt(e.target.value);
        if (chance >= 0 && chance <= 10) setChances(chance);
    };

    const initializeGame = () => {
        const totalCards = gridSize * gridSize;
        const pairCount = Math.floor(totalCards / 2);
        const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
        const shuffledCards = [...numbers, ...numbers]
            .sort(() => Math.random() - 0.5)
            .map((number, index) => ({ id: index, number }));

        setCards(shuffledCards);
        setFlippedCards([]);
        setSolved([]);
        setWin(false);
        setMoves(0);
        setGameOver(false);
    };

    useEffect(() => {
        initializeGame();
    }, [gridSize]);

    const checkMatch = (secondId) => {
        const [firstId] = flippedCards;
        if (cards[firstId].number === cards[secondId].number) {
            setSolved((prev) => [...prev, firstId, secondId]);
            setFlippedCards([]);
            setDisabled(false);
        } else {
            setTimeout(() => {
                setFlippedCards([]);
                setDisabled(false);
            }, 1000);
        }
    };

    const handleClick = (id) => {
        if (win || disabled || flippedCards.includes(id) || solved.includes(id)) return;

        if (moves >= chances - 1) {
            setWin(false);
            setGameOver(true);
            setTimeout(() => {
                initializeGame();
            }, 3000);
            return;
        }

        setMoves((prevMoves) => prevMoves + 1);

        if (flippedCards.length === 0) {
            setFlippedCards([id]);
        } else if (flippedCards.length === 1) {
            setFlippedCards((prev) => [...prev, id]);
            setDisabled(true);
            checkMatch(id);
        }
    };

    const isFlipped = (id) => flippedCards.includes(id) || solved.includes(id);

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWin(true);
            setGameOver(true);
        }
    }, [solved, cards]);

    return (
        <div className="relative h-full w-full bg-slate-950">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="flex flex-col items-center justify-center min-h-screen relative text-white p-4 z-50">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Memory Game</h1>
                <p className="mb-4 text-lg text-center">Match the cards to win the game.</p>

                <div className="mb-4 flex flex-col sm:flex-row items-center">
                    <label htmlFor="gridSize" className="mb-2 sm:mb-0 sm:mr-3 text-lg">Set Grid Size (max: 10)</label>
                    <input
                        type="number"
                        value={gridSize}
                        onChange={handleGridSize}
                        className="border-2 border-gray-300 rounded-md px-2 py-1 text-black w-20 mr-4"
                        max={10}
                        min={2}
                    />
                    <label htmlFor="chances" className="mb-2 sm:mb-0 sm:mr-3 text-lg">Max Moves</label>
                    <input
                        type="number"
                        value={chances}
                        onChange={handleChances}
                        className="border-2 border-gray-300 rounded-md px-2 py-1 text-black w-20"
                        max={10}
                        min={1}
                    />
                </div>

                <p className="mb-6">Moves: {moves} / {chances}</p>

                <div
                    className="grid gap-2 mb-4"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                        width: `min(100%, ${gridSize * 5.5}rem)`,
                    }}
                >
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => handleClick(card.id)}
                            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                                isFlipped(card.id)
                                    ? solved.includes(card.id)
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-400'
                            }`}
                        >
                            {isFlipped(card.id) ? card.number : '?'}
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <h1 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${win ? 'text-green-600' : 'text-red-800'}`}>
                        {win ? 'You Win' : 'You Lose'}
                    </h1>
                )}

                <button
                    onClick={initializeGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    {win ? 'Play Again' : 'Reset'}
                </button>
            </div>
        </div>
    );
};

export default MemoryGame;
