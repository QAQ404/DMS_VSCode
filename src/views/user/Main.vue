<script setup>
import { ref } from 'vue';

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const a = ref(new Date())
const b = ()=>{
alert(a.value.toLocaleDateString().split('/').join('-'))
}

</script>

<template>
    <el-card style="min-height: 99%;">
        <el-calendar v-model="a" class="TheCalendar" >
            <template #date-cell="{ data }">
                <el-space>
                    {{ data.day.split('-').slice(2).join('-') }}
                    <div v-if='true'>1</div>
                </el-space>
            </template>
        </el-calendar>
        <button @click="b">+</button>
        
    </el-card>
</template>

<style scoped>

.TheCalendar /deep/ .el-calendar-table .el-calendar-day{
    width: 100%;
    height: 40px;
    text-align: left;
  }
</style>