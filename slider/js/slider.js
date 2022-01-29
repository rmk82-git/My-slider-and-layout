"use strict";
// создание необходимых элементов
window.addEventListener("load", function () {
  const list = document.querySelector("#slider");
  const imgs = list.getElementsByTagName("img");

  const wrapper = document.createElement("div");
  const prevBtn = document.createElement("div");
  const nextBtn = document.createElement("div");
  const show = document.createElement("div");
  const dots = document.createElement("div");

  const width = parseInt(getComputedStyle(imgs[0]).width, 10);
  const v = 15; // скорость переключения слайдера

  let dotsArr = [];
  let dotsTrueArr = [];
  let index = 0;
  let disable = false; // флаг для выключения многократного нажатия на кнопку, пока идет анимация слайдера

  // создаем обертку для слайдера
  wrapper.className = "slider";
  list.before(wrapper);
  wrapper.append(show);
  show.append(list);

  // отрисовываем кнопку назад
  prevBtn.className = "prevBtn";
  show.before(prevBtn);
  prevBtn.innerHTML = "&#x25c4";

  // отрисовываем кнопку вперед
  nextBtn.className = "nextBtn";
  show.after(nextBtn);
  nextBtn.innerHTML = "&#x25ba";

  // отрисовываем точки
  dots.className = "dots";
  wrapper.append(dots);
  for (let i = 0; i < imgs.length; i++) {
    // проходимся циклом по всем изображениям и создаем для каждого точку
    let dotItem = document.createElement("div");
    dotItem.className = "dot dot" + i;
    dots.append(dotItem);
  }
  dotsArr = wrapper.querySelectorAll(".dot");
  dotsArr[index].classList.add("active"); // устанавливаем первую точку как активную
  dotsTrueArr = Array.prototype.slice.call(dotsArr); // преобразую NodeList в Array, чтобы отлавливать номер элемента dot, на котором произошло событие

  show.classList.add("sliderList");
  list.classList.add("sliderRow");

  // ОСНОВНЫЕ МЕТОДЫ
  //переключение слайдера назад
  function prev(e, startSl = index, nextSl = index - 1, callback) {
    if (!disable) {
      if (nextSl < 0) {
        list.style.left = -width + "px"; // смещаем лист на одну картинку влево
        prevFirst(e); // выполняем функцию prevFirst с параметром e
        return;
      }

      disable = true;
      let pos = startSl * width; // вычисляем текущую позицию
      let t = setInterval(() => {
        if (pos <= nextSl * width + 1) {
          // конечное положение, когда мы уже достаточно сместили позицию, чтобы следующая картинка появилась полностью
          dotActiveChange(e, startSl, nextSl); // переключаем активную точку
          index = nextSl;
          if (callback) {

            callback();
            dotActiveChange(e, 0, index);
          }
          clearInterval(t);
          disable = false;
          return;
        }
        //  каждые 20мс смещаем позицию (пока не сработает if выше)
        pos -= ((startSl - nextSl) * width) / v;
        list.style.left = -pos + "px";
      }, 20);
    }
  }

  // назад из крайнего левого положения слайдера
  function prevFirst(e) {
    let temp = imgs[imgs.length - 1].cloneNode(true);
    list.prepend(temp);
    prev(e, 1, 0, () => {
      temp.remove();
      list.style.left = -(imgs.length - 1) * width + "px"; // устанавливаем положение листа на последнее изображение
      index = imgs.length - 1; // устанавливаем индекс на последний
    });
  }

  // переключение слайдера вперед
  function next(e, startSl = index, nextSl = index + 1, callback) {
    if (!disable) {
      if (nextSl >= imgs.length) {
        nextLast(e, startSl, nextSl);
        return;
      }

      disable = true;
      let pos = startSl * width;
      let t = setInterval(() => {
        if (pos >= nextSl * width - 1) {
          dotActiveChange(e, startSl, nextSl);
          index = nextSl;
          if (callback) {
            callback();
          }
          clearInterval(t);
          disable = false;
          return;
        }
        pos += ((nextSl - startSl) * width) / v;
        list.style.left = -pos + "px";
      }, 20);
    }
  }

  // вперед из крайнего правого положения
  function nextLast(e, startSl, nextSl) {

    let temp = imgs[0].cloneNode(true);
    list.append(temp);
    next(e, startSl, nextSl, () => {
      temp.remove();
      list.style.left = 0;
      index = 0;
    });
  }

  // смена отображения активного dot
  function dotActiveChange(e, startSl, nextSl) {

    dotsArr[startSl].classList.remove("active");
    if (nextSl >= dotsArr.length) {
      nextSl = 0;
    }
    dotsArr[nextSl].classList.add("active"); // устанавливаем следующему слайду активное состояние
  }

  // обработка нажатия на точку
  function dotsMove(e) {
    let startSl = index; // присваиваем стартовый слайд к активному индексу
    let nextSl = dotsTrueArr.indexOf(e.target); // находим в массиве точек индекс той, которую нажали
    if (startSl > nextSl) {
      prev(e, startSl, nextSl); // если стартовый слайд > целевого - то мы движемся назад, поэтому вызываем функцию prev с параметрами стартового слайда и целевого слайда
    } else {
      next(e, startSl, nextSl); // иначе мы двигаемся вперед, и вызываем next
    }
  }

  // оформление подписки на события клика по обьектам
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  for (let i = 0; i < dotsArr.length; i++) {
    dotsArr[i].addEventListener("click", dotsMove);
  }

  //удаляем выделение кнопки при многократном нажатии на неё 
  prevBtn.onmousedown = prevBtn.onselectstart = function () {
    return false;
  };
  nextBtn.onmousedown = nextBtn.onselectstart = function () {
    return false;
  };
});
