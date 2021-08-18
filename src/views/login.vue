<template>
  <div>
    <p>{{ count }}</p>
    <button @click="onAjax">ajax</button>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import useCurrentInstance from '@/hooks/useCurrentInstance';
export default {
  setup(props, ctx) {
    console.log('setup');
    const { globalProperties } = useCurrentInstance();
    console.log(globalProperties);
    const state = reactive({
      count: 4,
    });
    onMounted(() => {
      onAjax();
    });
    const onAjax = () => {
      console.log(globalProperties.$tools.fmoney(10000));
      globalProperties
        .$axios({
          url: '/app/version/get',
          method: 'post',
          data: {
            test: 111,
          },
        })
        .then((res) => {})
        .catch((err) => {});
    };
    return {
      ...toRefs(state),
      onAjax,
    };
  },
};
</script>

<style></style>
