<template>
  <div id="timelineArea">
    <h3 id="timelineYear" :style="{ left: yearLeft + 'px' }">{{ year }}</h3>
    <div id="timeline"></div>
    <div
      id="timeline2"
      :style="{ width: timelineWidth + 'px', left: minX + 'px' }"
    ></div>
    <div
      id="timelineSlider"
      :style="{ left: sliderLeft + 'px' }"
      @mousedown="handleMouseDown"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minYear: 1970,
      maxYear: 2020,
      year: 1970,
      timelineWidth: 0,
      sliderLeft: 0,
      yearLeft: 0,
      isDragging: false,
      initLeft: 0,
      minX: 0,
      maxX: 0,
    };
  },
  mounted() {
    this.initPosition();
  },
  methods: {
    initPosition() {
      const timeline = document.getElementById("timeline");
      this.minX = timeline.offsetLeft;
      this.maxX = timeline.offsetLeft + timeline.offsetWidth;
      this.sliderLeft = Math.round(
        ((this.year - this.minYear) / (this.maxYear - this.minYear)) *
          (this.maxX - this.minX) +
          this.minX
      );
      this.timelineWidth = this.sliderLeft - this.minX;
      this.yearLeft = this.sliderLeft;
    },
    handleMouseDown(e) {
      e.preventDefault();
      this.initLeft = e.clientX - this.sliderLeft;
      this.isDragging = true;
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseMove(e) {
      e.preventDefault();
      if (this.isDragging) {
        let newLeft = e.clientX - this.initLeft;
        if (newLeft < this.minX) {
          newLeft = this.minX;
        }
        if (newLeft > this.maxX) {
          newLeft = this.maxX;
        }
        this.sliderLeft = newLeft;
        this.timelineWidth = newLeft - this.minX;
        this.yearLeft = newLeft;
        this.year = Math.round(
          ((newLeft - this.minX) / (this.maxX - this.minX)) *
            (this.maxYear - this.minYear) +
            this.minYear
        );
      }
    },
    handleMouseUp() {
      this.isDragging = false;
      console.log(this.year);
      this.$emit("change-year", this.year);
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
  },
};
</script>

<style>
#timelineArea {
  opacity: 0.4;
}
#timelineArea:hover {
  opacity: 1;
}
#timelineYear {
  position: absolute;
  top: 85%;
  left: 20%;
  font-size: 45px;
  font-weight: 700;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  color: #ea354400;
  transform: translate(-50%, -60px);
  cursor: default;
}
#timelineArea:hover #timelineYear {
  color: #ea3543;
}
#timeline {
  position: absolute;
  height: 25px;
  width: 60%;
  top: 85%;
  left: 20%;
  background-color: #ffe5e7;
  border-radius: 5px;
}
#timeline2 {
  position: absolute;
  height: 25px;
  top: 85%;
  background-color: #f1a2ab;
  border-radius: 5px;
}
#timelineSlider {
  position: absolute;
  height: 25px;
  width: 15px;
  top: 85%;
  transform: translate(-50%, 0%);
  background-color: #ea3543;
  border-radius: 5px;
}
</style>
