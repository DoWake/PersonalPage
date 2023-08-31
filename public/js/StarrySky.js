/**
 * Starry Sky
 * 
 * 作者: DoWake
 * 描述：使用Canvas绘制星空
 * 地址：https://github.com/DoWake/StarrySky
 * 日期：2023/03/02
 */

const StarrySky = function () {
  //Canvas元素
  let canvasElement;
  //Canvas 2D对象
  let canvasContext;
  //Canvas 宽度
  let canvasWidth;
  //Canvas 高度
  let canvasHeight;
  //星星列表
  let starList;
  //星星颜色列表，rgb格式："255, 255, 255"
  let starColorList;
  //星星半径大小
  let starRadius;
  //焦距等级，与canvasWidth相乘，必须大于0
  let focalDistanceLevel;
  //星星数量等级，与canvasWidth相乘，必须大于0
  let starCountLevel;
  //星星速度等级，与焦距相乘，必须大于0
  let starSpeedLevel;
  //焦距
  let focalDistance;
  //星星数量
  let starCount;
  //执行动画
  let rAF;
  return {
    //初始化
    init: function (canvas_element) {
      if (canvas_element && canvas_element.nodeName === "CANVAS") {
        canvasElement = canvas_element;
        canvasElement.width = canvasElement.clientWidth;
        canvasElement.height = canvasElement.clientHeight;
        canvasElement.style.backgroundColor = "black";
        canvasContext = canvasElement.getContext("2d");
        canvasWidth = canvasElement.clientWidth;
        canvasHeight = canvasElement.clientHeight;
        starColorList = ["255, 255, 255"];
        starRadius = 1;
        focalDistanceLevel = 0.4;
        starCountLevel = 0.2;
        starSpeedLevel = 0.0005;
        focalDistance = canvasWidth * focalDistanceLevel;
        starCount = Math.ceil(canvasWidth * starCountLevel);
        starList = [];
        for (let i = 0; i < starCount; i++) {
          starList[i] = {
            x: canvasWidth * (0.1 + 0.8 * Math.random()),
            y: canvasHeight * (0.1 + 0.8 * Math.random()),
            z: focalDistance * Math.random(),
            color: starColorList[Math.ceil(Math.random() * 1000) % starColorList.length]
          }
        }
        const self = this;
        window.addEventListener("resize", self.throttle(function () {
          canvasElement.width = canvasElement.clientWidth;
          canvasElement.height = canvasElement.clientHeight;
          canvasWidth = canvasElement.clientWidth;
          canvasHeight = canvasElement.clientHeight;
          focalDistance = canvasWidth * focalDistanceLevel;

          const starCount2 = Math.ceil(canvasWidth * starCountLevel);
          if (starCount > starCount2) {
            starList.splice(starCount2);
          } else {
            let num = starCount2 - starCount;
            while (num--) {
              starList.push({
                x: canvasWidth * (0.1 + 0.8 * Math.random()),
                y: canvasHeight * (0.1 + 0.8 * Math.random()),
                z: focalDistance * Math.random(),
                color: starColorList[Math.ceil(Math.random() * 1000) % starColorList.length]
              });
            }
          }
          starCount = Math.ceil(canvasWidth * starCountLevel);
        }, 200));
      } else {
        console.error('初始化失败，必须传入Canvas元素');
      }
    },
    //设置星空背景颜色
    setSkyColor: function (sky_color = "black") {
      canvasElement.style.backgroundColor = sky_color;
    },
    //设置星星半径大小
    setStarRadius: function (star_radius = 1) {
      starRadius = star_radius;
    },
    //设置焦距等级
    setFocalDistanceLevel: function (focal_distance_level = 0.4) {
      focalDistanceLevel = focal_distance_level;
      focalDistance = canvasWidth * focalDistanceLevel
    },
    //设置星星数量等级
    setStarCountLevel: function (star_count_level = 0.2) {
      starCountLevel = star_count_level;
      const starCount2 = Math.ceil(canvasWidth * starCountLevel);
      if (starCount > starCount2) {
        starList.splice(starCount2);
      } else {
        let num = starCount2 - starCount;
        while (num--) {
          starList.push({
            x: canvasWidth * (0.1 + 0.8 * Math.random()),
            y: canvasHeight * (0.1 + 0.8 * Math.random()),
            z: focalDistance * Math.random(),
            color: starColorList[Math.ceil(Math.random() * 1000) % starColorList.length]
          });
        }
      }
      starCount = Math.ceil(canvasWidth * starCountLevel);
    },
    //设置星星速度等级
    setStarSpeedLevel: function (star_speed_level = 0.0005) {
      starSpeedLevel = star_speed_level
    },
    /**
     * 设置星星颜色
     * @param {Array|String} color 星星颜色
     * @param {Boolean} mode 是否立刻同步颜色
     */
    setStarColorList: function (color, mode = false) {
      if (typeof color === 'object') {
        starColorList = color;
      } else if (typeof color === 'string') {
        starColorList.push(color);
      }
      if (mode) {
        for (let i = 0; i < starList.length; i++) {
          starList[i]["color"] = starColorList[Math.ceil(Math.random() * 1000) % starColorList.length];
        }
      }
    },
    //渲染
    render: function () {
      const starSpeed = canvasWidth * focalDistanceLevel * starSpeedLevel;
      //清空画布
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      //计算位置
      for (let i = 0; i < starList.length; i++) {
        const star = starList[i];
        const star_x = (star["x"] - canvasWidth / 2) * (focalDistance / star["z"]) + canvasWidth / 2;
        const star_y = (star["y"] - canvasHeight / 2) * (focalDistance / star["z"]) + canvasHeight / 2;
        star["z"] -= starSpeed;
        if (star["z"] > 0 && star["z"] <= focalDistance && star_x >= -20 && star_x <= canvasWidth + 20 && star_y >= -20 && star_y <= canvasHeight + 20) {
          const star_radius = starRadius * (focalDistance / star["z"] * 0.8);
          const star_opacity = 1 - 0.8 * (star["z"] / focalDistance);
          canvasContext.fillStyle = "rgba(" + star["color"] + ", " + star_opacity + ")";
          canvasContext.shadowOffsetX = 0;
          canvasContext.shadowOffsetY = 0;
          canvasContext.shadowColor = "rgb(" + star["color"] + ")";
          canvasContext.shadowBlur = 10;
          canvasContext.beginPath();
          canvasContext.arc(star_x, star_y, star_radius, 0, 2 * Math.PI);
          canvasContext.fill();
        } else {
          const z = focalDistance * Math.random();
          star["x"] = canvasWidth * (0.1 + 0.8 * Math.random());
          star["y"] = canvasHeight * (0.1 + 0.8 * Math.random());
          star["z"] = z;
          star["color"] = starColorList[Math.ceil(Math.random() * 1000) % starColorList.length];
        }
      }
      const self = this;
      rAF = window.requestAnimationFrame(function () {
        self.render();
      });
    },
    //销毁
    destroy: function () {
      window.cancelAnimationFrame(rAF);
      starList = [];
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      canvasElement.width = 0;
      canvasElement.height = 0;
    },
    //防抖
    debounce: function (func, time = 200) {
      let timeId;
      return function () {
        if (timeId) {
          clearTimeout(timeId);
        }
        timeId = setTimeout(function () {
          func();
        }, time);
      }
    },
    //节流
    throttle: function (func, time = 200) {
      let timeId = null;
      let pre = 0;
      return function () {
        if (Date.now() - pre > time) {
          clearTimeout(timeId);
          pre = Date.now();
          func();
        } else {
          timeId = setTimeout(func, time);
        }
      };
    }
  }
}();