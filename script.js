/* =====================================================
   script.js — вся интерактивность сайта
   Комментарии объясняют, ЧТО делает код и ЗАЧЕМ.
   ===================================================== */

// Ждём, пока весь HTML загрузится, и только потом ищем элементы.
// Без этого document.getElementById может вернуть null,
// если скрипт выполнится раньше, чем появится нужный тег.
document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------
     1. МОБИЛЬНОЕ МЕНЮ (бургер)
     --------------------------------------------------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', function () {
    // classList.toggle сам решает: добавить класс или убрать,
    // если его ещё нет — добавит, если есть — уберёт.
    const isOpen = nav.classList.toggle('nav--open');
    burger.classList.toggle('burger--active', isOpen);

    // aria-expanded — сообщает программам чтения с экрана,
    // открыто меню или нет. Хорошая практика доступности.
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Когда кликаем на ссылку в меню — закрываем его.
  // Иначе на телефоне после перехода к разделу меню останется открытым.
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav--open');
      burger.classList.remove('burger--active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });


  /* ---------------------------------------------------
     2. ТЕНЬ У ШАПКИ ПРИ ПРОКРУТКЕ
     --------------------------------------------------- */
  const header = document.querySelector('.header');

  window.addEventListener('scroll', function () {
    // window.scrollY — сколько пикселей прокручено от начала страницы
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  });


  /* ---------------------------------------------------
     3. ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОКРУТКЕ (reveal on scroll)
     Используем IntersectionObserver — браузер сам следит,
     появился ли элемент на экране, без ручного подсчёта
     scrollY на каждый пиксель (это быстрее и экономнее).
     --------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.about__card, .menu__item'
  );

  revealTargets.forEach(function (el) {
    el.classList.add('reveal'); // сначала прячем элемент через CSS
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        // Как только показали элемент один раз — больше не следим за ним
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15 // сработает, когда виден хотя бы 15% элемента
  });

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });


  /* ---------------------------------------------------
     4. МОДАЛЬНОЕ ОКНО БРОНИРОВАНИЯ
     --------------------------------------------------- */
  const modal = document.getElementById('booking-modal');
  const openBtn = document.getElementById('open-booking');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');

  function openModal() {
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden'; // блокируем прокрутку фона
    document.getElementById('field-name').focus(); // сразу ставим курсор в первое поле
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Закрытие по клавише Escape — ожидаемое поведение для модалок
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });


  /* ---------------------------------------------------
     5. ВАЛИДАЦИЯ ФОРМЫ БРОНИРОВАНИЯ
     Проверяем поля сами, без встроенных браузерных
     всплывашек — так можно полностью управлять текстом
     и внешним видом ошибок.
     --------------------------------------------------- */
  const form = document.getElementById('booking-form');
  const successMessage = document.getElementById('modal-success');

  const nameInput = document.getElementById('field-name');
  const phoneInput = document.getElementById('field-phone');
  const nameError = document.getElementById('error-name');
  const phoneError = document.getElementById('error-phone');

  // Простая проверка телефона: минимум 10 цифр, остальное (скобки, дефисы) неважно
  function isPhoneValid(value) {
    const digitsOnly = value.replace(/\D/g, ''); // убираем всё, кроме цифр
    return digitsOnly.length >= 10;
  }

  form.addEventListener('submit', function (event) {
    // preventDefault останавливает обычную отправку формы —
    // иначе браузер попытается перезагрузить страницу
    event.preventDefault();

    let isValid = true;

    // --- проверка имени ---
    if (nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      nameError.textContent = 'Введите имя (минимум 2 буквы)';
      isValid = false;
    } else {
      nameInput.classList.remove('invalid');
      nameError.textContent = '';
    }

    // --- проверка телефона ---
    if (!isPhoneValid(phoneInput.value)) {
      phoneInput.classList.add('invalid');
      phoneError.textContent = 'Введите номер телефона полностью';
      isValid = false;
    } else {
      phoneInput.classList.remove('invalid');
      phoneError.textContent = '';
    }

    if (!isValid) {
      return; // если есть ошибки — дальше не идём
    }

    // Здесь в реальном проекте был бы fetch() запрос на сервер, например:
    //
    // fetch('/api/booking', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name: nameInput.value,
    //     phone: phoneInput.value
    //   })
    // });
    //
    // Так как это учебный пример без бэкенда, просто показываем
    // сообщение об успехе и очищаем форму.

    successMessage.classList.add('modal__success--visible');
    form.reset();

    setTimeout(function () {
      closeModal();
      successMessage.classList.remove('modal__success--visible');
    }, 1800);
  });

});
