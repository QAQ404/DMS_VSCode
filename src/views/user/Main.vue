<script setup>
import SeeInfoDialog from '@/components/SeeInfoDialog.vue';
import {ref,provide} from 'vue'


const ifShowSeeInfoDialogVue = ref(false)
provide('ifShowSeeInfoDialogVue',ifShowSeeInfoDialogVue)
provide('changeifShowSeeInfoDialogVue',(newISSIDV)=>{
    ifShowSeeInfoDialogVue.value = newISSIDV;
})


</script>

<template>
    <el-card style="min-height: 99%;">
        我是主页面  <button @click="ifShowSeeInfoDialogVue=true">弹窗，启动</button>
        <SeeInfoDialog />
    </el-card>
</template>

<style scoped>

</style>