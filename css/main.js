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
  const footer = $('.contacts__footer');
  dots.first().addClass('dot-menu__item--active');
  sections.first().addClass('active__section');
  let inScroll = false;
  let overMap = false;

  const md = new MobileDetect(window.navigator.userAgent);

  footer.on('click', function (e) {
    overMap = false;
  });

  const performTransition = sectionEq => {

    if (overMap) {
      console.log('курсор над картой, блок скролла')
    } else {
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

  $('#map').hover(() => {
    overMap = true;
    console.log(overMap);
  },
    () => {
      overMap = false;
      console.log(overMap);
    });

  $('#map').on('click', () => {
    overMap = true;
    console.log(overMap);
  });


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


// player


const video = document.getElementById('video');
const playBtn = document.querySelector('.player__start-button');
const playBack = document.querySelector('.player__playback-button');
const soundTrigger = document.querySelector('.player__sound-trigger');
const soundBtn = document.querySelector('.player__sound-button');
const playBtnPlay = document.querySelector('.player__start-button:before');
const soundPoint = document.querySelector('.player__sound-point');
const playBackPoint = document.querySelector('.player__playback-point');
const currentTime = document.querySelector('.player__duration-completed');
const totalTime = document.querySelector('.player__duration-estimate');


let isPlay = false;
let interval;

playBtn.addEventListener('click', e => {
  e.preventDefault();
  if (isPlay == false) {
    video.play();
    onPlay();
    isPlay = true;
    playBtn.classList.toggle('playing');
  } else {
    video.pause();
    isPlay = false;
    offPlay(interval);
    playBtn.classList.toggle('playing');
  }
  soundTrigger.addEventListener('click', e => {
    e.preventDefault();
    if (video.muted) {
      video.muted = false;
      soundTrigger.classList.toggle('muted');
      soundPoint.style.left = video.volume * 100 + '%';
    } else {
      video.muted = true;
      soundTrigger.classList.toggle('muted');
      soundPoint.style.left = 0 + '%';
    }
  });
});



soundBtn.addEventListener('click', function (e) {
  e.preventDefault();
  let clickPosition = e.layerX;
  let barWidth = soundBtn.offsetWidth;
  let calcVol = toPercent(clickPosition, barWidth);

  if (calcVol >= 0 && calcVol <= 1) {
    volumeSet(calcVol);
    if (video.muted) {
      soundTrigger.classList.toggle('muted');
    }
    video.muted = false;
    console.log(calcVol);
    console.log(soundPoint.style.left);
    soundPoint.style.left = calcVol * 100 + '%';
    console.log(clickPosition);
    console.log(soundBtn.offsetWidth);
  } else {
    console.log('не попали по кнопке');
  }
});

playBack.addEventListener('click', function (e) {
  e.preventDefault();
  let clickPosition = e.layerX;
  let barWidth = playBack.offsetWidth;
  let calcPlay = toPercent(clickPosition, barWidth);
  videoSet(toSecs(calcPlay));
  currentTime.textContent = formatTime(video.currentTime);
  playBackPoint.style.left = calcPlay * 100 + '%';
})

function formatTime (timeSec) {
  const roundTime = Math.round(timeSec);

  const minutes = Math.floor(roundTime / 60);
  const seconds = roundTime - minutes * 60;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;
}

function onPlay() {
  let durationSec = video.duration;
  totalTime.textContent = formatTime(durationSec);
  console.log(durationSec);
  interval = setInterval(() => {
    const completedSec = video.currentTime;
    console.log(completedSec);
    const completedPercent = toPercent(completedSec, durationSec) * 100 + '%';
    console.log(completedPercent);
    playBackPoint.style.left = completedPercent;
    console.log(video.ended);
    currentTime.textContent = formatTime(completedSec);
    if (video.ended) {
      clearInterval(interval);
      currentTime.textContent = formatTime(0);
    }
  }, 1000);
}
function offPlay(interval) {
  clearInterval(interval);
}

function volumeSet(volume) {
  video.volume = volume;
};

function videoSet(currSecs) {
  video.currentTime = currSecs;
}

function toSecs(percent) {
  let currSecs = video.duration * percent;
  return currSecs;
}

function toPercent(curr, all) {
  return curr / all;
};



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

//map

function initMap() {
  // The location of Uluru
  
  var center = { lat: 55.755126, lng: 37.5968415 };
  var chocco1 = { lat: 55.750953, lng: 37.6046722 };
  var chocco2 = { lat: 55.761027, lng: 37.5772682 };
  var chocco3 = { lat: 55.759743, lng: 37.6249754 };
  var chocco4 = { lat: 55.748784, lng: 37.5804504 };
  // The map, centered at Uluru
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 14.25, center: center });
    // The marker, positioned at Uluru
    var chocco1 = new google.maps.Marker({ position: chocco1, map: map });
    var chocco2 = new google.maps.Marker({ position: chocco2, map: map });
    var chocco3 = new google.maps.Marker({ position: chocco3, map: map });
    var chocco4 = new google.maps.Marker({ position: chocco4, map: map });
    chocco1.setLabel('CHOCCO');
    chocco1.setTitle('CHOCCO');
    chocco2.setLabel('CHOCCO');
    chocco2.setTitle('CHOCCO');
    chocco3.setLabel('CHOCCO');
    chocco3.setTitle('CHOCCO');
    chocco4.setLabel('CHOCCO');
    chocco4.setTitle('CHOCCO');
  
}
