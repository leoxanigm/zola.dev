// function expression to select elements

const selectEl = (s) => document.querySelector(s);

// open menu on click

selectEl('.open').addEventListener('click', () => {
  selectEl('.nav-list').classList.add('active');
});

selectEl('.close').addEventListener('click', () => {
  selectEl('.nav-list').classList.remove('active');
});