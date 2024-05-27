const timelineSlider = document.getElementById("timelineSlider");
const timeline = document.getElementById("timeline");
const timeline2 = document.getElementById("timeline2");
const timelineArea = document.getElementById("timelineArea");
const timelineYear = document.getElementById("timelineYear");
const minYear = 1970;
const maxYear = 2020;
var year;

timelineSlider.addEventListener("mousedown", function (e1) {
  let initLeft = timelineSlider.offsetLeft;
  let minX = timeline.offsetLeft;
  let maxX = timeline.offsetLeft + timeline.offsetWidth;
  function move(e2) {
    e2.preventDefault();
    let deltaX = e2.clientX - e1.clientX;
    timelineSlider.style.left = initLeft + deltaX + "px";
    if (timelineSlider.offsetLeft < minX) {
      timelineSlider.style.left = minX + "px";
    }
    if (timelineSlider.offsetLeft > maxX) {
      timelineSlider.style.left = maxX + "px";
    }
    timeline2.style.width =
      timelineSlider.offsetLeft - timeline.offsetLeft + "px";
    timelineYear.style.left = timelineSlider.offsetLeft + "px";
    year = Math.round(
      ((timelineSlider.offsetLeft - minX) / (maxX - minX)) *
        (maxYear - minYear) +
        minYear
    );
    timelineYear.innerText = year;
  }
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", function up() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  });
});

function moveTimelineSlider() {
  let minX = timeline.offsetLeft;
  let maxX = timeline.offsetLeft + timeline.offsetWidth;
  timelineSlider.style.left =
    Math.round(
      ((year - minYear) / (maxYear - minYear)) * (maxX - minX) + minX
    ) + "px";
  timeline2.style.width =
    timelineSlider.offsetLeft - timeline.offsetLeft + "px";
  timelineYear.style.left = timelineSlider.offsetLeft + "px";
}
