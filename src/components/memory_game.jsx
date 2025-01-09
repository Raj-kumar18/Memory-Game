import React, { useEffect } from 'react'
import { use } from 'react'
import { useState } from 'react'
const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4)
    const [cards, setCards] = useState([])
    const [flippedCards, setFlippedCards] = useState([])
    const [solved, setSolved] = useState([])
    const [win, setWin] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const handleGridSize = (e) => {
        const size = parseInt(e.target.value)
        if (size >= 2 && size <= 10) setGridSize(size)

    }

    const initalizeGame = () => {
        const toralCards = gridSize * gridSize
        const pairCount = Math.floor(toralCards / 2)
        const numbers = [...Array(pairCount).keys()].map((n) => n + 1)
        const suffledCards = [...numbers, ...numbers]
            .sort(() => Math.random() - 0.5)
            .slice(0, toralCards)
            .map((number, index) => ({ id: index, number }))

        setCards(suffledCards)
        console.log(suffledCards)
        setFlippedCards([])
        setSolved([])
        setWin(false)
    }

    useEffect(() => {
        initalizeGame()
    }, [gridSize])

    const checkMatch = (secondId) => {
        const [firstId] = flippedCards
        if (cards[firstId].number === cards[secondId].number) {
            setSolved([...solved, firstId, secondId])
            setFlippedCards([])
            setDisabled(false)
        }
        else {
            setTimeout(() => {
                setFlippedCards([])
                setDisabled(false)
            }, 1000);
        }
    }

    const handleClick = (id) => {
        if (win || disabled) return;

        if (flippedCards.length === 0) {
            setFlippedCards([id])
            return;
        }

        if (flippedCards.length === 1) {
            setDisabled(true)
            if (id !== flippedCards[0]) {
                setFlippedCards([...flippedCards, id])
                // check for match logic
                checkMatch(id)
            }
            else {
                setFlippedCards([])
                setDisabled(false)
            }
        }

    }


    const isFlipped = (id) => flippedCards.includes(id) || solved.includes(id)
    const isSloved = (id) => solved.includes(id)

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWin(true)
        }
    }, [solved,cards])

    return (
        <>
       <div class="relative h-full w-full bg-slate-950">
    {/* Background pattern */}
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    
    {/* Main content */}
    <div className="flex flex-col items-center justify-center min-h-screen relative text-white p-4 z-50">
        {/* Game title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Memory Game</h1>
        
        {/* Input field for grid size */}
        <div className="mb-4 flex flex-col sm:flex-row items-center">
            <label htmlFor="gridSize" className="mb-2 sm:mb-0 sm:mr-3 text-lg">Set Grid Size (max: 10)</label>
            <input
                type="number"
                name="gridSize"
                value={gridSize}
                onChange={handleGridSize}
                className="border-2 border-gray-300 rounded-md px-2 py-1 text-black w-20"
                max={10}
                min={2}
            />
        </div>

        {/* Game board */}
        <div
            className="grid gap-2 mb-4"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: `min(100%, ${gridSize * 5.5}rem)`,
            }}
        >
            {cards.map((card) => (
                <div
                    onClick={() => handleClick(card.id)}
                    key={card.id}
                    className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg transition-all duration-300 cursor-pointer
                        ${
                            isFlipped(card.id)
                                ? isSloved(card.id)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-400'
                        }`}
                >
                    {isFlipped(card.id) ? card.number : '?'}
                </div>
            ))}
        </div>

        {/* Result message */}
        {win && (
            <div className="text-2xl font-bold text-green-700 animate-bounce text-center">
                !You Won
            </div>
        )}

        {/* Reset / Play Again button */}
        <button
            onClick={initalizeGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
            {win ? 'Play Again' : 'Reset'}
        </button>
    </div>
</div>

        </>
    )
}

export default MemoryGame