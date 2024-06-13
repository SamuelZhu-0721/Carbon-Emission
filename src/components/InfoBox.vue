<template>
  <div id="infoBox" v-drag>
    <CloseOutlined id="closeInfoBox" @click="closeInfoBox"></CloseOutlined>
    <h2>{{ this.myCurrCountry }}</h2>
    <a-table
      id="showTable"
      :dataSource="totalData"
      :columns="columns"
      size="small"
    />
  </div>
</template>

<script>
import { CloseOutlined } from "@ant-design/icons-vue";

export default {
  directives: {
    drag(el) {
      el.onmousedown = function (e) {
        const disx = e.pageX - el.offsetLeft;
        const disy = e.pageY - el.offsetTop;
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + "px";
          el.style.top = e.pageY - disy + "px";
        };
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        };
      };
    },
  },
  components: {
    CloseOutlined,
  },
  data() {
    return {
      left: 70,
      top: 30,
      totalData: [],
      myCurrCountry: "CHINA",
      columns: [
        {
          title: "年份",
          dataIndex: "year",
          key: "year",
        },
        {
          title: "总和",
          dataIndex: "total",
          key: "total",
        },
        {
          title: "人均",
          dataIndex: "avg",
          key: "avg",
        },
        {
          title: "总和增长率",
          dataIndex: "increasing",
          key: "increasing",
        },
      ],
      jsonSource: null,
      jsonSourcePer: null,
    };
  },
  props: {
    currCountry: {
      type: String,
      default: null,
    },
  },
  watch: {
    currCountry(newValue) {
      this.myCurrCountry = newValue;
      this.loadList();
    },
  },
  mounted() {
    this.loadGeoJson();
  },
  methods: {
    loadGeoJson() {
      fetch("/data/total.geojson")
        .then((response) => response.json())
        .then((data) => {
          this.jsonSource = data;
        })
        .catch((error) =>
          console.error("Error loading the geojson data: ", error)
        );
      fetch("/data/total_per.geojson")
        .then((response) => response.json())
        .then((data) => {
          this.jsonSourcePer = data;
        })
        .catch((error) =>
          console.error("Error loading the geojson data: ", error)
        );
    },
    loadList() {
      const temp = this.jsonSource.features;
      let thisCountryProperties = null;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].properties.NAME === this.myCurrCountry) {
          thisCountryProperties = temp[i].properties;
          break;
        }
      }
      const tempPer = this.jsonSourcePer.features;
      let thisCountryPropertiesPer = null;
      for (let i = 0; i < tempPer.length; i++) {
        if (tempPer[i].properties.NAME === this.myCurrCountry) {
          thisCountryPropertiesPer = tempPer[i].properties;
          break;
        }
      }
      if (!thisCountryProperties || !thisCountryPropertiesPer) {
        alert("该国数据缺失！");
      } else {
        this.totalData = [];
        const newData = {
          key: 1,
          year: 1970,
          total: (Number(thisCountryProperties[`F1970`]) / 10000).toFixed(2) + "万",
          avg: Number(thisCountryPropertiesPer[`F1970`]).toFixed(2),
          increasing: "/",
        };
        this.totalData.push(newData);
        for (let i = 1971; i <= 2020; i++) {
          const thisYear = Number(thisCountryProperties[`F${i}`]);
          const lastYear = Number(thisCountryProperties[`F${i - 1}`]);
          const increasing =
            lastYear === 0
              ? "/"
              : (((thisYear - lastYear) / lastYear) * 100).toFixed(2) + "%";
          const newData = {
            key: i - 1969,
            year: i,
            total: (thisYear / 10000).toFixed(2) + "万",
            avg: Number(thisCountryPropertiesPer[`F${i}`]).toFixed(2),
            increasing: increasing,
          };
          this.totalData.push(newData);
        }
      }
    },
    closeInfoBox() {
      this.$emit("change-isInfoBoxShow");
    },
  },
};
</script>

<style scoped>
#infoBox {
  position: absolute;
  left: v-bind(left + "px");
  top: v-bind(top + "px");
  z-index: 2000;
  width: 500px;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #ffffff88;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 1px 2px 5px #0000001a;
}
#infoBox h2 {
  display: inline-block;
  margin: 0 auto;
  margin-bottom: 10px;
  margin-top: 0;
  color: #ea3543;

  padding: 2px 10px 2px 10px;
  border-radius: 5px;
  background-color: #fbe6e7;
}
#closeInfoBox {
  font-size: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
