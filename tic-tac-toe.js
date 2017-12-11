$(document).ready(() => {

    function init() {
        $(".X-O").show();
        $(".game").hide();
        $("#reset").hide();
    };

    init();

    // ----------- Variables 

    let player1Choice = "";
    let computer = "";
    var origBoard;
    const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];
    const cells = $('.cell');

    //--------- Buttons Settings

    function choseX() {
        player1Choice = $("#btn-x").text();
        computer = $("#btn-o").text();
    };

    function choseO() {
        player1Choice = $("#btn-o").text();
        computer = $("#btn-x").text();

    };

    function onPlayGameClicked() {
        if (player1Choice !== "") {
            $(".X-O").hide();
            $(".game").fadeIn(1000);

            if (player1Choice == "X") {
                computer = "O";
            } else if (player1Choice == "O") {
                computer = "X";
            }
            startGame();
        } else {
            alert("Please select X or O!")
        }
    };

    function startGame() {
        origBoard = Array.from(Array(9).keys());
        for (let i = 0; i < cells.length; i++) {
            $(cells[i]).text('');
            $(cells[i]).removeClass('winner');
            $(cells[i]).on('click', turnClick);
        }
        $("#reset").show();

    };

    function reset() {
        startGame();
        init();
    };

    $("#btn-x").click(choseX);

    $("#btn-o").click(choseO);

    $("#btn-play").click(onPlayGameClicked);

    $("#reset").click(reset);

    //--------- Game Settings

    function turnClick(square) {
        if (typeof origBoard[square.target.id] == 'number') {
            turn(square.target.id, player1Choice)
            if (!checkWin(origBoard, player1Choice) && !checkTie()) turn(bestSpot(), computer);
        }
    };

    function turn(squareId, player) {
        origBoard[squareId] = player;
        $(`#${squareId}`).text(player);
        let gameWon = checkWin(origBoard, player)
        if (gameWon) gameOver(gameWon)
    };

    function checkWin(board, player) {
        let plays = board.reduce((a, e, i) =>
            (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for (let [index, win] of winCombos.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = {
                    index: index,
                    player: player
                };
                break;
            }
        }
        return gameWon;
    };

    function gameOver(gameWon) {
        for (let index of winCombos[gameWon.index]) {
            $(`#${index}`).addClass('winner');
        }
        for (var i = 0; i < cells.length; i++) {
            $(cells[i]).off('click', turnClick);
        }
        declareWinner(gameWon.player);
    };

    function declareWinner(who) {
        if (who == player1Choice) {
            $(".player1-overlay").css("display", "block");
            $(".player1-overlay").click(() => {
                $(".player1-overlay").css("display", "none")
                reset();
            })
        } else if (who == computer) {
            $(".computer-overlay").css("display", "block");
            $(".computer-overlay").click(() => {
                $(".computer-overlay").css("display", "none")
                reset();
            })
        }
    };

    function emptySquares() {
        return origBoard.filter(s => typeof s == 'number');
    };

    function bestSpot() {
        return minimax(origBoard, computer).index;
    };

    function checkTie() {
        if (emptySquares().length == 0) {
            for (var i = 0; i < cells.length; i++) {
                $(cells[i]).off('click', turnClick);
                $(".draw-overlay").css("display", "block");
                $(".draw-overlay").click(() => {
                    $(".draw-overlay").css("display", "none")
                    reset();
                })

            }
            declareWinner("Tie Game!")
            return true;
        }
        return false;
    };

    function minimax(newBoard, player) {
        var availSpots = emptySquares(newBoard);

        if (checkWin(newBoard, player1Choice)) {
            return {
                score: -10
            };
        } else if (checkWin(newBoard, computer)) {
            return {
                score: 10
            };
        } else if (availSpots.length === 0) {
            return {
                score: 0
            };
        }
        var moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if (player == computer) {
                var result = minimax(newBoard, player1Choice);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, computer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        var bestMove;
        if (player === computer) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    };

});
