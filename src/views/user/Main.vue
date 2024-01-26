<script setup>
import { ref } from 'vue';
const a = ref(new Date())
const b = ()=>{
alert(a.value.toLocaleDateString().split('/').join('-'))
}

</script>

<template>
    <el-card style="min-height: 99%;">
        <button @click="b">+</button>
        <el-calendar v-model="a">
            <template #date-cell="{ data, date }">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '✔️' : '' }}
                </p>{{ date }}
                <div v-if="data.day === '2024-01-01'">1</div>
            </template>
        </el-calendar>
    </el-card>
</template>

<style scoped></style>