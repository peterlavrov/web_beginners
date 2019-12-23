$(document).ready(function () {

  //bar

  const sliderWrap = $('.bar__wrap');
  const sliderList = $('.bar__list')
  const prevArr = $('.bar__prev-link');
  const nextArr = $('.bar__next-link');
  const slidesNum = $('.bar__item').length;
  let currentSlide = 1;
  let currentPos = 0;

  function animateSlide() {
    sliderList.stop(true, false).animate({
      left: currentPos + '%'
    }, 1000)
  }

  prevArr.on('click', e => {
    e.preventDefault();

    if (currentSlide > 1) {
      currentPos += 100;
      currentSlide--;
      animateSlide();
    } else {
      currentPos = (-slidesNum + 1) * 100;
      currentSlide = slidesNum;
      animateSlide();
    }

  });

  nextArr.on('click', e => {
    e.preventDefault();

    if (currentSlide < slidesNum) {
      currentPos -= 100;
      currentSlide++;
      animateSlide();
    } else {
      currentPos = 0;
      currentSlide = 1;
      animateSlide();
    }
  });

  //onepage scroll

  const display = $('.maincontent');
  const sections = $('section');
  const dots = $('.dot-menu__item');
  dots.first().addClass('dot-menu__item--active');
  sections.first().addClass('active__section');
  let inScroll = false;

  const md = new MobileDetect(window.navigator.userAgent);


  const performTransition = sectionEq => {
    if (inScroll == false) {
      inScroll = true;
      const position = sectionEq * -100;

      sections.eq(sectionEq)
        .addClass('active__section')
        .siblings()
        .removeClass('active__section');

      display.css({
        transform: `translateY(${position}%)`
      })

      display.on('transitionend', () => {
        inScroll = false;

        $('.dot-menu__item').eq(sectionEq)
          .addClass('dot-menu__item--active')
          .siblings()
          .removeClass('dot-menu__item--active');
      })
    }
  }

  const scrollToSection = direction => {
    const activeSection = sections.filter('.active__section');
    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    if (direction == 'next' && nextSection.length) {
      performTransition(nextSection.index());
    }

    if (direction == 'prev' && prevSection.length) {
      performTransition(prevSection.index());
    }
  }

  $(window).on('wheel', e => {
    const deltaY = e.originalEvent.deltaY;
    console.log(deltaY);

    if (deltaY > 0) {
      console.log('next');
      scrollToSection('next');
    }

    if (deltaY < 0) {
      console.log('prev');
      scrollToSection('prev');
    }
  });

  $(window).on('keydown', e => {
    console.log(e.key);

    const tagName = e.target.tagName.toLowerCase();
    console.log(tagName);

    if (tagName != 'input' && tagName != 'textarea') {
      if (e.key == 'ArrowUp') {
        scrollToSection('prev');
      }

      if (e.key == 'ArrowDown') {
        scrollToSection('next');
      }
    }

  })

  $('[data-scroll-to]').on('click', e => {
    e.preventDefault();
    const $this = $(e.currentTarget);
    const target = $this.attr('data-scroll-to');
    performTransition(target);
    console.log($this.hasClass('fullscreen-menu__link'));

    if ($this.hasClass('fullscreen-menu__link')) {
      $('.fullscreen-menu').css('display', 'none');
    }
  })
  if (md.mobile()) {
    $(function () {
      $("body").swipe({
        //Generic swipe handler for all directions
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
          const ScrollDirections = direction == 'up' ? 'next' : 'prev';
          scrollToSection(ScrollDirections);
        }
      });

      //Set some options later
      $("body").swipe({ fingers: 1 });
    });

  }

});

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

// const leftArrow = document.querySelector('.bar__prev-link');
// const rightArrow = document.querySelector('.bar__next-link');
// const barList = document.querySelector('.bar__list');

// leftArrow.addEventListener('click', function (e) {
//   e.preventDefault();
//   infiniteTurn(leftArrow);
// });

// rightArrow.addEventListener('click', function (e) {
//   e.preventDefault();
//   infiniteTurn(rightArrow);
// });

// function infiniteTurn(direction) {
//   if (direction == rightArrow) {
//     barList.appendChild(barList.firstElementChild);
//   } else {
//     barList.insertBefore(barList.lastElementChild, barList.firstElementChild);
//   }
// }


//team

const itemMember = document.querySelectorAll('.team__member');
const itemAbout = document.querySelectorAll('.team__member-name');
const memberLenght = itemMember.length;

function activeMemberDel() {
  for (let i = 0; i < memberLenght; i++) {
    if (itemMember[i].classList.contains('team__member--active')) {
      itemMember[i].classList.remove('team__member--active');
    }
  }
}

for (let i = 0; i < memberLenght; i++) {
  itemAbout[i].addEventListener('click', function (e) {
    e.preventDefault();
    console.log('клик');
    console.log(itemMember[i].classList);
    if (itemMember[i].classList.contains('team__member--active')) {
      itemMember[i].classList.remove('team__member--active');
    } else {
      activeMemberDel();
      itemMember[i].classList.add('team__member--active');
    }
  })
};

//menu

const item = document.querySelectorAll('.menu__item');
const title = document.querySelectorAll('.menu__item-title');
const close = document.querySelectorAll('.menu__item-desc-close');
const itemLenght = item.length;

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
const phone = document.querySelector('#phone');
const floor = document.querySelector('#floor');
const apart = document.querySelector('#apart');

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

      if (elem.tagName === 'A') {
        modal.style.display = 'none';
      }
    });


  });
});

phone.addEventListener('keydown', function (e) {
  let isDigit = false;
  let isDash = false;
  let isControl = false;

  if (e.key >= 0 || e.key <= 9) {
    isDigit = true;
    console.log('цифра');
  }

  if (e.key == '-') {
    isDash = true;
    console.log('тире');
  }

  if (e.key == 'ArrowRight' || e.key == 'ArrowLeft' || e.key == 'Backspace' || e.key == 'Tab') {
    isControl = true;
    console.log('контрольная клавиша');
  }

  if (!isDigit && !isDash && !isControl) {
    e.preventDefault();
  }
});



apart.addEventListener('keydown', function (e) {
  let isDigit = false;
  let isControl = false;

  if (e.key >= 0 || e.key <= 9) {
    isDigit = true;
    console.log('цифра');
  }

  if (e.key == 'ArrowRight' || e.key == 'ArrowLeft' || e.key == 'Backspace' || e.key == 'Tab') {
    isControl = true;
    console.log('контрольная клавиша');
  }

  if (!isDigit && !isControl) {
    e.preventDefault();
  }
});

floor.addEventListener('keydown', function (e) {
  let isDigit = false;
  let isControl = false;

  if (e.key >= 0 || e.key <= 9) {
    isDigit = true;
    console.log('цифра');
  }

  if (e.key == 'ArrowRight' || e.key == 'ArrowLeft' || e.key == 'Backspace' || e.key == 'Tab') {
    isControl = true;
    console.log('контрольная клавиша');
  }

  if (!isDigit && !isControl) {
    e.preventDefault();
  }
});
