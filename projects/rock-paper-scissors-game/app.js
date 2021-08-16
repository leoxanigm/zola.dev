document.addEventListener('DOMContentLoaded', loadGame);

function loadGame() {
  const gameBoard = document.getElementById('game'),
    paper = document.getElementById('paper'),
    scissor = document.getElementById('scissor'),
    rock = document.getElementById('rock'),
    gameElements = document.querySelectorAll('.game-el'),
    house = document.getElementById('house'),
    outcomeTxt = document.getElementById('outcome'),
    playBtn = document.getElementById('play-again'),
    playCountEl = document.querySelector('#plays .plays'),
    scoreEl = document.querySelector('#score .score');

  const gameArr = [rock, paper, scissor];

  let score = 0,
    plays = 0;

  gameBoard.addEventListener('click', play);

  function play(e) {

    if (
      !this.classList.contains('play') &&
      !this.classList.contains('outcome')
    ) {
      let selectedEl = e.target;

      gameElements.forEach(el => {
        el.classList.remove('selected-house');
        el.classList.remove('selected-player');
      });

      plays++;
      playCountEl.textContent = plays;

      this.classList.add('play');
      selectedEl.classList.add('selected-player');

      house.style.display = 'block';

      setTimeout(() => {
        let housePick = gameArr[Math.floor(Math.random() * 3)];
        let duplicateEl;

        this.classList.add('outcome');
        house.style.display = 'none';

        gameElements.forEach(el => {
          if (housePick.id === el.id) duplicateEl = el.cloneNode();
        });

        duplicateEl.id = 'clone';
        duplicateEl.className = '';
        duplicateEl.classList.add('game-el');
        duplicateEl.classList.add('selected-house');
        gameBoard.appendChild(duplicateEl);

        if (housePick.id === selectedEl.id) {
          outcomeTxt.textContent = "It's a tie";
          score++;
          scoreEl.textContent = score;
        } else if (housePick.id === 'rock' && selectedEl.id === 'paper') {
          outcomeTxt.textContent = 'You win!';
          score++;
          scoreEl.textContent = score;
        } else if (housePick.id === 'rock' && selectedEl.id === 'scissor') {
          outcomeTxt.textContent = 'You Lose';
        } else if (housePick.id === 'paper' && selectedEl.id === 'rock') {
          outcomeTxt.textContent = 'You Lose';
        } else if (housePick.id === 'paper' && selectedEl.id === 'scissor') {
          outcomeTxt.textContent = 'You win!';
          score++;
          scoreEl.textContent = score;
        } else if (housePick.id === 'scissor' && selectedEl.id === 'rock') {
          outcomeTxt.textContent = 'You win!';
          score++;
          scoreEl.textContent = score;
        } else if (housePick.id === 'scissor' && selectedEl.id === 'paper') {
          outcomeTxt.textContent = 'You Lose';
        }
      }, 300);
    }

    if (
      this.classList.contains('play') &&
      this.classList.contains('outcome') &&
      e.target.id === 'play-again'
    ) {
      gameBoard.removeChild(gameBoard.querySelector('#clone'));
      outcomeTxt.textContent = '';
      this.classList.remove('play');
      this.classList.remove('outcome');
    }

    //to do
    // when it is a tie, duplicate the element, in html dom, add id with 'original-id'-duplicate
    // also add appropriate styles for example flex order
    // additionaly add the remaining conditions

    // console.log(e.target)
  }
}
