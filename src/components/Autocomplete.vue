<template>
  <div id="autocompleteArea">
    <a-auto-complete
      v-model:value="value"
      :options="options"
      style="width: 200px"
      placeholder="输入国家"
      @select="onSelect"
      @search="onSearch"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios"; // 引入axios库

export default {
  name: "AutocompleteSearch",
  setup(props, { emit }) {
    const value = ref("");
    const options = ref([]);

    const onSelect = (value) => {
      // 从选项中找到与选中值匹配的项
      const selectedOption = options.value.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        console.log("onSelect", selectedOption);
        // 发射包括名称和经纬度的完整数据
        emit("searchAndSelected", {
          name: selectedOption.value,
          latitude: selectedOption.latitude,
          longitude: selectedOption.longitude,
        });
      }
    };

    const onSearch = async (searchText) => {
      if (!searchText) {
        options.value = [];
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/search", {
          params: { query: searchText },
        });

        options.value = response.data.map((item) => ({
          value: item.name,
          label: `${item.name} (Lat: ${item.latitude}, Long: ${item.longitude})`,
          latitude: item.latitude,
          longitude: item.longitude,
        }));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    return {
      value,
      options,
      onSelect,
      onSearch,
    };
  },
};
</script>

<style scoped>
#autocompleteArea {
  position: absolute;
  top: 45px;
  right: 5px;
}
</style>
