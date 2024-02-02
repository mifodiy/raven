document.addEventListener('DOMContentLoaded', function () {
	
	function countInit() {
		const counts = document.querySelectorAll('.counter__number');
		const counter = []

		for(let i = 0; i < counts.length; i++){
			counter[i] = +counts[i].getAttribute('data-to');
		}

		function count(start, value, id) {
			let startValue = start
			const intervalID = setInterval(()=>{
				if(startValue <= value){
					counts[id].innerHTML = startValue;
					startValue++
				}
				if(startValue > value){
					clearInterval(intervalID);
				}
			}, 4)
		}

		for(let j = 0; j < counts.length; j++){
			count(0, counter[j], j)
		}
	}

	var target = document.getElementById('target');

  var options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Якщо більше 50% елементу видно, то викликати колбек
  };

  var observer = new IntersectionObserver(handleIntersection, options);

  // Початкова ініціалізація спостерігача для цільового елемента
  observer.observe(target);

  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Якщо елемент з'явився в області видимості
        countInit()
        observer.unobserve(entry.target); // Зупинити спостерігання, бо ми вже визначилися
      }
    });
  }

	const swiper = new Swiper('.swiper', {
		
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
			clickable: true,
    },
		direction: "vertical",
		slidesPerView: 1,
		mousewheel: {
			invert: false,
		},
  
    

  //   // Responsive breakpoints
  //   breakpoints: {
  //   // when window width is >= 320px
  //   320: {
  //     slidesPerView: 3,
  //     spaceBetween: 20
  //   },
  //   // when window width is >= 480px
  //   480: {
  //     slidesPerView: 3,
  //     spaceBetween: 30
  //   },
  // }
  });

  const burger = document.querySelector('.menu__btn');
  const closeMenu = document.querySelector('.side-menu__btn');
  const mobileMenu = document.querySelector('.side-menu');
  const bodyLock = document.querySelector('body');

  if (burger != null) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.add('side-menu--active');
      bodyLock.classList.add('lock');
    });
  }

  if (closeMenu != null) {
    closeMenu.addEventListener('click', () => {
      mobileMenu.classList.remove('side-menu--active');
      bodyLock.classList.remove('lock');
    });
  }
})