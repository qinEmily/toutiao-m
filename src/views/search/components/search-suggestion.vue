<template>
  <div class="suggestion-container">
    <van-cell
    v-for="(text,index) in suggestions"
    :key="index"
    icon="search"
    @click="$emit('sugSearch',text)"
    >
    <div slot="title" v-html="highLight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getSearchSuggestion } from '@/api/search'
export default {
  name: 'SuggestionPage',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 用debounce函数包起来防抖, debounce(一个函数，延迟时间)
      handler: debounce(function (val) {
        // console.log(val)
        this.getSuggestions(val)
      }, 500),
      immediate: true
    }
  },
  created () {},
  methods: {
    async getSuggestions (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取数据失败')
      }
    },
    highLight (text) {
      const highLightStr = `<span style="color:#3296fa">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi') // 正则表达式里面如果出现了变量需要这么写
      if (text) {
        return text.replace(reg, highLightStr)
      }
    }
  }
}
</script>

<style scoped></style>
