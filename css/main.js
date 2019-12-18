//fullscreen menu

const hamburger = document.querySelector('.hamburger-menu__link');
const fscreen = document.querySelector('.fullscreen-menu');
const closebtn = document.querySelector('.fullscreen-menu__close');

function noScroll() {
  window.scrollTo(0, 0);
}


hamburger.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('клик на гамбургер меню');
  fscreen.classList.add('fullscreen-menu--active');
  window.addEventListener('scroll', noScroll);
});
closebtn.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('клик на кнопку закрыть');
  fscreen.classList.remove('fullscreen-menu--active');
  window.removeEventListener('scroll', noScroll);
});

// bar

const leftArrow = document.querySelector('.bar__prev-link');
const rightArrow = document.querySelector('.bar__next-link');
const barList = document.querySelector('.bar__list');

leftArrow.addEventListener('click', function (e) {
  e.preventDefault();
  infiniteTurn(leftArrow);
});

rightArrow.addEventListener('click', function (e) {
  e.preventDefault();
  infiniteTurn(rightArrow);
});

function infiniteTurn(direction) {
  if (direction == rightArrow) {
    barList.appendChild(barList.firstElementChild);
  } else {
    barList.insertBefore(barList.lastElementChild, barList.firstElementChild);
  }
}

//menu

const item = document.querySelectorAll('.menu__item');
const title = document.querySelectorAll('.menu__item-title');
const close = document.querySelectorAll('.menu__item-desc-close');
const itemLenght = item.length;
console.log(itemLenght);

function activeElemDel() {
  for (let i = 0; i < itemLenght; i++) {
    if (item[i].classList.contains('menu__item--active')) {
      item[i].classList.remove('menu__item--active');
    }
  }
}

for (let i = 0; i < itemLenght; i++) {
  close[i].addEventListener('click', function (e) {
    e.preventDefault();
    activeElemDel();
  })
}

for (let i = 0; i < itemLenght; i++) {
  title[i].addEventListener('click', function (e) {
    e.preventDefault();
    console.log('клик');
    console.log(item[i].classList);
    if (item[i].classList.contains('menu__item--active')) {
      item[i].classList.remove('menu__item--active');
    } else {
      activeElemDel();
      item[i].classList.add('menu__item--active');
    }
  })
}

//comments

const commentsPost = document.querySelectorAll('.comments__post');
const commentsLink = document.querySelectorAll('.comments__authors-author-link');
const numComments = commentsPost.length;

function activeAuthorCheck() {
  for (let i = 0; i < numComments; i++) {
    if (commentsPost[i].classList.contains('comments__post--active')) {
      commentsPost[i].classList.remove('comments__post--active');
      commentsLink[i].classList.remove('comments__authors--active');
    }
  }
}


for (let i = 0; i < numComments; i++) {
  commentsLink[i].addEventListener('click', function (e) {
    e.preventDefault();
    console.log('клик на ' + i + 'том элементе');
    if (commentsPost[i].classList.contains('comments__post--active')) {
      console.log('клик на активном элементе, ничего не меняем');
    } else {
      activeAuthorCheck();

      commentsPost[i].classList.add('comments__post--active');
      commentsLink[i].classList.add('comments__authors--active');
    }
  })
}

//form

const form = document.querySelector('.order__form');
const modal = document.querySelector('.modal');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  formData.append('to', 'email@email.ua');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail/');
  xhr.send(formData);
  xhr.addEventListener('load', () => {
    if (xhr.status >= 400) {
      console.log('что то пошло не так');
    } else {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      modal.style.display = 'flex';
    }

    document.addEventListener('keyup', e => {
      let keyName = e.key;
      console.log(keyName);
      if (keyName === 'Escape') {
        modal.style.display = 'none';
      }
    });

    modal.addEventListener('click', e => {
      e.preventDefault();
      let elem = e.target;
      console.log(elem);

      if (elem.tagName === 'A'){
        modal.style.display = 'none';
      }
    })

  })
});