const Board = () => {
  // 1st player is X ie 1
  // State keeps track of next player and gameState
  const [player, setPlayer] = React.useState(1);
  const [gameState, setGameState] = React.useState([]);
  const[theme,setTheme] = React.useState('classic');
  let status = `Winner is: ${checkForWinner(gameState)}`;
  let playerStatus;
  let playerNum;
  if(status == 'Winner is: No Winner Yet'){
  if(player === 1) playerNum = '1';
  if(player === 0) playerNum = '2';
  playerStatus = `Next Turn: Player ${playerNum}`;
  }
  const newGame = () => {
    document.location.reload()
   }

  const takeTurn = (id) => {
    setGameState([...gameState, { id: id, player: player }]);
    setPlayer((player + 1) % 2); // get next player
    return player;
  };
  function renderSquare(i) {
    // use properties to pass callback function takeTurn to Child
    return <Square takeTurn={takeTurn} id={i} status={status} theme={theme}></Square>;
  }
  const handleTheme = (e) => {
    setTheme(e.target.value)
  }
let updatedStatus = status;
if(status == 'Winner is: No Winner Yet') updatedStatus = '';
if(status == 'Winner is: Cats Game') updatedStatus = 'Cats Game';
console.log(updatedStatus)
  return (<>
  <div className="theme-select">Theme:
    <select id={`select-${theme}`} onChange={(e) => {handleTheme(e)}}>
    <option value="classic" >Classic</option>
      <option value="dark" >Dark</option>
      <option value="light">Light</option>
      <option value="colourful">Colourful</option>
    </select>
    </div>
    <br/>
    <div className={`game-board-${theme}`}>
      <div className={`grid-row-${theme}`}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={`grid-row-${theme}`}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={`grid-row-${theme}`}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div id="info">
        <h1 id='turn'>{playerStatus}</h1>
        <h1>{updatedStatus}</h1>
        <button className= "new-game-btn" onClick={newGame}>New Game</button>
      </div>
    </div>
</>);
};

const Square = ({ takeTurn, id, status,theme }) => {
  const mark = ['O', 'X', ''];
  //console.log(theme)
  // id is the square's number
  // filled tells you if square has been filled
  // tik tells you symbol in square (same as player)
  // You call takeTurn to tell Parent that the square has been filled
  const [filled, setFilled] = React.useState(false);
  const [tik, setTik] = React.useState(2);
  return (<>
    <button 
    id={theme}
      //Colors 'X' with red and 'O' with white
      className={ tik == '1' ? "red" : "white"}
      onClick={(e) => {
        if(filled) return;
        //console.log(`${status}`)
        if(status !== 'Winner is: No Winner Yet') return;
        setTik(takeTurn(id));
        setFilled(true);
        //console.log(`Square: ${id} filled by player : ${tik}`);
      }}
    >
      <h1>{mark[tik]}</h1>
    </button>
  </>);
};

const Game = () => {
  return (
    <div className="game">
      <Board></Board>
    </div>
  );
};

const win = [
  // win by rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // win by cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // win by diagonal
  [0, 4, 8],
  [2, 4, 6],
];

const checkPlayerTurn = (gameState) => {
  return gameState.player;
};

const checkForWinner = (gameState) => {
 
  // get array of box id's
  // can't be a winner in less than 5 turns
  if (gameState.length < 5) return 'No Winner Yet';
  let p0 = gameState.filter((item) => {
    if (item.player == 0) return item;
  });
  p0 = p0.map((item) => item.id);
  let px = gameState.filter((item) => {
    if (item.player == 1) return item;
  });
  px = px.map((item) => item.id);
  if (p0 != null && px != null) {
    var win0 = win.filter((item) => {
      return isSuperset(new Set(p0), new Set(item));
    });
    var winX = win.filter((item) => {
      return isSuperset(new Set(px), new Set(item));
    });
    if(gameState.length == 9 && win0.length == 0 && winX.length == 0) return 'Cats Game'
  }
  if (win0.length > 0) return 'Player 2';
  else if (winX.length > 0) return 'Player 1 ';
  return 'No Winner Yet';
};
// check if subset is in the set
function isSuperset(set, subset) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

  