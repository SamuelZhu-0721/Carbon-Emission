<template>
  <div id="infoBox">
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
  components: {
    CloseOutlined,
  },
  data() {
    return {
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
      ],
      jsonSource: null,
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
      if (!thisCountryProperties) {
        alert("该国数据缺失！");
      } else {
        // console.log(thisCountryProperties);
        this.totalData = [];
        for (let i = 1970; i <= 2020; i++) {
          const newData = {
            key: i - 1969,
            year: i,
            total: Number(thisCountryProperties[`F${i}`]).toFixed(2),
            avg: Number(thisCountryProperties[`F${i}`]).toFixed(2),
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

<style>
#infoBox {
  position: absolute;
  right: 10px;
  z-index: 100;
  top: 10%;
  width: 500px;
  /* max-height: 80%; */
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #ffffffa4;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px #0000001a;
}
#infoBox h2 {
  margin-top: 0;
  color: #333;
}
#closeInfoBox {
  font-size: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
