<script setup>
import router from '@/routers'
const a = ()=>{
    router.push('/student/studentInfo')
}
</script>

<template>
    <el-card style="min-height: 99%;">
        学生管理
        <el-button @click="a">+</el-button>
    </el-card>
</template>

<style scoped>

</style>