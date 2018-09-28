import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    )
  }

  renderSquaresInRow(i) {
    let squares = [];

    for (let j = i; j < i + 3; j++) {
      squares.push(this.renderSquare(j));
    }

    return squares;
  }

  renderBoardRow(i) {
    return (
      <div className="board-row" key={i}>
        {this.renderSquaresInRow(i)}
      </div>
    )
  }

  renderBoard() {
    let rows = [];

    for (let i = 0; i < 9; i++) {
      if ( i === 0 || i % 3 === 0 ) {
        rows.push(this.renderBoardRow(i));
      }
    }

    return rows;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        positions: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      stepPos: {
        col: null,
        row: null,
      }
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positions = current.positions.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X': 'O';
    positions[i] = {
      col: i % 3,
      row: Math.floor(i / 3),
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        positions: positions,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    console.log(history);

    const moves = history.map((step, move) => {
      console.log(move);
      const desc = move 
        ? `Go to move #${move} at position col: ${step.positions[move]}; row: ${step.positions[move]}`
        : `go to game start`;

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status = '';
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} 
            onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}