document.addEventListener('DOMContentLoaded', function() {
  const __CONFIG = {
    animatrixContainer: document.getElementsByClassName('animatrix')[0],
    data: [
      // {
      //   id: block.id,
      //   show: true,
      //   group: block.getAttribute('data-group'),
      //   originalPosition: [300, 400],
      //   animatedPosition: [300, 200],
      //   originalIndex: 4,
      //   animatedIndex: 1,
      //   animation: 'slide',
      //   scale: 1,
      //   opacity: 1
      // }
    ],
    animations: {
      slide: function(id) {
        const currEl = this.data[id]; // currently animated element
        currEl.style.transform = `translate(${currEl.animatedPosition[0]}px, ${
          currEl.animatedPosition[1]
        }px) scale(1, 1)`;
        currEl.style.opacity = 1;
      },
      flip: {},
      sort: {}
    },
    preferences: {
      blockWidth: 300,
      blockHeight: 200,
      containerWidth: window.innerWidth,
      responsive: true
    }
  };

  const init = () => {
    try {
      const blocks = [...__CONFIG.animatrixContainer.querySelectorAll('.block')];
      blocks.forEach((block, index) => {
        __CONFIG.data.push({
          id: block.getAttribute('data-id'),
          show: true,
          group: block.getAttribute('data-group'),
          originalPosition: [300, 400],
          animatedPosition: [300, 200],
          originalIndex: 4,
          animatedIndex: 1,
          animation: 'slide',
          scale: 1,
          opacity: 1
        });
      });
    } catch(err) {
      console.error(
        'Please add "animatrix" class name to the container of the list you want animated.'
      );
    }
  };

  init();

  toggleBlocks();

  document.querySelectorAll('.selector li').forEach(sel => {
    sel.addEventListener('click', function(e) {
      toggleBlocks(e.target.id);
    });
  });

  // const data = [];

  // document.querySelectorAll('.block').forEach(block => {
  //   data.push({
  //     id: block.id,
  //     show: true,
  //     group: block.getAttribute('data-group'),
  //     originalPosition: [300, 400],
  //     animatedPosition: [300, 200],
  //     originalIndex: 4,
  //     animatedIndex: 1,
  //     animation: 'slide',
  //     scale: 1,
  //     opacity: 1
  //   });
  // });

  console.log(__CONFIG);

  // const data = [
  //   {
  //     id: 'block0',
  //     show: true,
  //     group: 'section1',
  //     originalPosition: [0, 300],
  //     animatedPosition: [200, 600],
  //     animation: 'slide',
  //     scale: 1,
  //     opacity: 1
  //   }
  // ];

  function arranger(el) {
    let count = 0;
    let coorArr = []; // coordinate array to store coordinates used for arrangement
    for (let i = 1; i < el.length + 2; i++) {
      if (i % 2 === 0) {
        for (let j = 0; j <= 600; j += 300) {
          coorArr.push([j, count]);
        }
        count += 200;
      }
    }
    coorArr.forEach((item, index) => {
      if (el[index]) {
        el[index].style.transform = `translate(${item[0]}px, ${
          item[1]
        }px) scale(1, 1)`;
        el[index].style.opacity = 1;
      }
    });
  }

  function toggleBlocks(selectedClass) {
    if (!selectedClass) {
      const allBlocks = document.querySelectorAll('.block');
      arranger(allBlocks);
    } else {
      const notSelBlocks = document.querySelectorAll(
        `.block:not(.${selectedClass})`
      );
      notSelBlocks.forEach(block => {
        block.style.opacity = 0;
        block.style.transform = `${
          block.style.transform.match(/tra(.*?)\)/)[0]
        } scale(0, 0)`;
      });
      const selBlocks = document.querySelectorAll(`.block.${selectedClass}`);
      arranger(selBlocks);
    }
  }
});
