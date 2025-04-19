import { ref } from "vue"

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<button @click="count++">plus</button><div>Count is: {{ count }}</div>`
}