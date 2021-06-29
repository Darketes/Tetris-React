import React from 'react';
import './App.css';
import { HEIGHT, PIECESIZE, SCALE, WIDTH } from './Constants';
import { cellColor } from './utils/cellColor';
import { createGrid } from './utils/createGrid';
import { getRandomNumber } from './utils/getRandomNumber';
import { useRunGame } from './utils/useRunGame';
import { useTrackKeys } from './utils/useTrackKeys';

const pieces = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
];

const App: React.FC = () => {
  const [visualGrid, setVisualGrid] = React.useState(() =>
    createGrid(HEIGHT, WIDTH)
  );
  const [stateGrid, setStateGrid] = React.useState(() =>
    createGrid(HEIGHT, WIDTH)
  );
  const [currentPiece, setCurrentPice] = React.useState(
    getRandomNumber(pieces)
  );

  const [nextPiece, setNextPiece] = React.useState(
    getRandomNumber(pieces)
  );

  const [score, setScore] = React.useState(0);

  const [gameover, setGameover] = React.useState(false);

  const [velocity, setVelocity] = React.useState(0);

  const [entitie, setEntitie] = React.useState(() => ({
    rotate: 1,
    piece: pieces[currentPiece],
    nextPiece: pieces[nextPiece],
    pos: { x: WIDTH / 2 - 2, y: -4 },
  }));

  const down = useTrackKeys();

  const rotateEntitie = React.useCallback(() => {
    const entitieCopy: number[] = [];
    switch (entitie.rotate) {
      case 0: {
        for (let y = 0; y < PIECESIZE; y++)
          for (let x = 0; x < PIECESIZE; x++)
            entitieCopy[y * PIECESIZE + x] =
              pieces[currentPiece][y * PIECESIZE + x];

        break;
      }
      case 1: {
        for (let y = 0; y < PIECESIZE; y++)
          for (let x = 0; x < PIECESIZE; x++)
            entitieCopy[y * PIECESIZE + x] =
              pieces[currentPiece][
                y + entitie.piece.length - PIECESIZE - PIECESIZE * x
              ];
        break;
      }

      case 2: {
        for (let y = 0; y < PIECESIZE; y++)
          for (let x = 0; x < PIECESIZE; x++)
            entitieCopy[y * PIECESIZE + x] =
              pieces[currentPiece][
                entitie.piece.length - 1 - PIECESIZE * y - x
              ];
        break;
      }

      case 3: {
        for (let y = 0; y < PIECESIZE; y++)
          for (let x = 0; x < PIECESIZE; x++)
            entitieCopy[y * PIECESIZE + x] =
              pieces[currentPiece][PIECESIZE - 1 - y + x * PIECESIZE];

        break;
      }
    }
    return entitieCopy;
  }, [entitie, currentPiece]);

  const doesPieceFit = React.useCallback(
    (
      copy: {
        rotate: number;
        piece: number[];
        pos: {
          x: number;
          y: number;
        };
      },
      state: number[]
    ) => {
      //sides
      for (let y = 0; y < PIECESIZE; y++) {
        for (let x = 0; x < PIECESIZE; x++) {
          if (copy.piece[y * PIECESIZE + x] === 1) {
            if (
              // right side
              (copy.pos.y + y) * WIDTH + (copy.pos.x + x) >=
                WIDTH * (copy.pos.y + y + 1) ||
              // left side
              (copy.pos.y + y) * WIDTH + (copy.pos.x + x) <
                WIDTH * (copy.pos.y + y) ||
              //bottom side
              (copy.pos.y + y) * WIDTH + (copy.pos.x + x) >
                WIDTH * HEIGHT - 1
            )
              return false;

            //checks if there is a tetromino already
            if (
              state[(copy.pos.y + y) * WIDTH + (copy.pos.x + x)] !==
              undefined
            )
              if (
                state[(copy.pos.y + y) * WIDTH + (copy.pos.x + x)] !==
                0
              )
                return false;
          }
        }
      }
      return true;
    },
    []
  );

  const update = () => {
    if (!doesPieceFit(entitie, stateGrid)) {
      console.log('gameover');
      setGameover(gameover => !gameover);
    }

    let stateGridCopy = [...stateGrid];
    const visualGridCopy = [...stateGrid];
    const entitieCopy = { ...entitie };

    // Movement

    let xSpeed = 0;
    let ySpeed = 0;

    if (down.ArrowLeft) xSpeed -= 1;
    if (down.ArrowRight) xSpeed += 1;
    if (down.ArrowDown) ySpeed += 1;
    if (down.keyZ) {
      down.keyZ = false;
      entitieCopy.piece = rotateEntitie();
      if (!doesPieceFit(entitieCopy, stateGridCopy))
        entitieCopy.piece = entitie.piece;
      const count = entitieCopy.rotate + 1;
      entitieCopy.rotate = count % 4;
    }

    entitieCopy.pos.x += xSpeed;
    if (!doesPieceFit(entitieCopy, stateGridCopy))
      entitieCopy.pos.x -= xSpeed;

    entitieCopy.pos.y += ySpeed;
    if (!doesPieceFit(entitieCopy, stateGridCopy))
      entitieCopy.pos.y -= ySpeed;

    // is there space down?

    if (velocity > 10) {
      setVelocity(0);
      entitieCopy.pos.y++;
    } else {
      setVelocity(velocity => velocity + score + 1);
    }

    if (!doesPieceFit(entitieCopy, stateGridCopy)) {
      entitieCopy.pos.y--;
      // Change state and get next figure
      for (let y = 0; y < 4; y++)
        for (let x = 0; x < 4; x++) {
          if (
            (entitieCopy.pos.y + y) * WIDTH +
              (entitieCopy.pos.x + x) >=
            WIDTH * HEIGHT
          )
            continue;
          stateGridCopy[
            (entitieCopy.pos.y + y) * WIDTH + (entitieCopy.pos.x + x)
          ] = entitieCopy.piece[y * PIECESIZE + x]
            ? currentPiece + 1
            : stateGridCopy[
                (entitieCopy.pos.y + y) * WIDTH +
                  (entitieCopy.pos.x + x)
              ];
        }

      // Checks if there is a tetromino full row

      for (let y = 0; y < HEIGHT; y++) {
        let count = 0;
        for (let x = 0; x < WIDTH; x++) {
          if (stateGridCopy[y * WIDTH + x] != 0) count++;
        }
        if (count === WIDTH) {
          const array0 = Array(WIDTH).fill(0);
          const array1 = stateGridCopy.slice(0, y * WIDTH);
          const array2 = stateGridCopy.slice(y * WIDTH + WIDTH);
          stateGridCopy = array0.concat(array1.concat(array2));
          setScore(score => score + 1);
        }
      }

      const number = getRandomNumber(pieces);
      setCurrentPice(nextPiece);
      setNextPiece(number);
      setEntitie({
        rotate: 1,
        piece: pieces[nextPiece],
        nextPiece: pieces[number],
        pos: { x: WIDTH / 2 - 2, y: -4 },
      });
      setStateGrid(stateGridCopy);
    } else {
      console.log(stateGridCopy);
      // Representing figure
      for (let y = 0; y < 4; y++)
        for (let x = 0; x < 4; x++) {
          if (
            (entitieCopy.pos.y + y) * WIDTH +
              (entitieCopy.pos.x + x) >=
            WIDTH * HEIGHT
          )
            continue;
          visualGridCopy[
            (entitieCopy.pos.y + y) * WIDTH + (entitieCopy.pos.x + x)
          ] = entitieCopy.piece[y * 4 + x]
            ? currentPiece + 1
            : stateGridCopy[
                (entitieCopy.pos.y + y) * WIDTH +
                  (entitieCopy.pos.x + x)
              ];
        }
      // Updating states
      setVisualGrid(visualGridCopy);
      setEntitie({
        ...entitie,
        ...entitieCopy,
      });
    }
  };

  useRunGame(update, gameover);

  React.useEffect(() => {
    if (gameover) {
      window.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          setGameover(false);
          setStateGrid(() => createGrid(WIDTH, HEIGHT));
          setVisualGrid(() => createGrid(WIDTH, HEIGHT));
          setScore(0);
          setVelocity(0);
        }
      });
    }
  }, [gameover]);

  if (gameover)
    return (
      <>
        <div className='column'>
          <h1>YOU LOSE</h1>
          <div>{score}</div>
          <button
            style={{
              margin: '40px',
              color: '#fff',
              border: '1px solid #000',
              backgroundColor: '#000',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '38px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '15px',
            }}
            onClick={() => {
              setGameover(false);
              setStateGrid(() => createGrid(WIDTH, HEIGHT));
              setVisualGrid(() => createGrid(WIDTH, HEIGHT));
              setScore(0);
              setVelocity(0);
            }}>
            <span>CLICK TO RESTART GAME </span>
            <span>OR</span>
            <span>PRESS ENTER</span>
          </button>
        </div>
      </>
    );

  return (
    <>
      <main>
        <div
          className='column '
          style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: `repeat(${WIDTH},${SCALE}px)`,
          }}>
          {visualGrid.map((object, i) => {
            return (
              <div
                key={i.toString()}
                style={{
                  width: `${SCALE}px`,
                  height: `${SCALE}px`,
                  backgroundColor: `${
                    visualGrid[i] ? cellColor(object) : ''
                  }`,
                }}
                className={'box'}></div>
            );
          })}
        </div>
        <div className='column '>
          <div
            style={{
              border: '3px solid #000',
              margin: '10px',
              width: '150px',
              height: '50px',
              textAlign: 'center',
              paddingTop: '18px',
            }}>
            {score}
          </div>
          <div
            style={{
              width: '150px',
              border: '3px solid #000',
              textAlign: 'center',
            }}>
            <h5>Next Piece</h5>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(4, ${SCALE}px)`,
              }}>
              {pieces[nextPiece].map((_, index) => (
                <div
                  key={index.toString()}
                  style={{
                    width: `${SCALE}px`,
                    height: `${SCALE}px`,
                    backgroundColor: `${
                      pieces[nextPiece][index]
                        ? `${cellColor(nextPiece + 1)}`
                        : ''
                    }`,
                  }}></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
