<script setup>
//显示详细信息的弹窗组件
import { ref, inject } from 'vue'
import defaultPicture from '@/assets/default2.jpg'

const ifShowSeeInfoDialogVue = inject('ifShowSeeInfoDialogVue') //是否显示弹窗
const changeISSIDV = inject('changeifShowSeeInfoDialogVue');    //接收修改是否显示弹窗的功能
const closeDialog = () => {   //子用父，关闭弹窗
    changeISSIDV(false);
}

const SeeInfoDialogType = inject('SeeInfoDialogType')   //数据来源
const SeeInfoDialogData = inject('SeeInfoDialogData');  //从父组件中获取展示的数据

</script>

<template>
    <el-dialog v-model="ifShowSeeInfoDialogVue" @close="closeDialog()" draggable title="详细信息">
        <el-descriptions border :column="2" v-if="SeeInfoDialogType === 'building'"> <!-- 楼栋详细信息 -->
            <el-descriptions-item> <template #label> 楼栋名称 </template> {{ SeeInfoDialogData.name }} </el-descriptions-item>
            <el-descriptions-item> <template #label> 单元数 </template> {{ SeeInfoDialogData.unitNumber }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 寝室数 </template> {{ SeeInfoDialogData.dorNumber }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 学生数 </template> {{ SeeInfoDialogData.stuNumber }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 宿管 </template>编号{{ SeeInfoDialogData.workId }}-{{ SeeInfoDialogData.manName }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 建造年份 </template> {{ SeeInfoDialogData.buildYear }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 楼层数 </template> {{ SeeInfoDialogData.floorNumber }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 更新时间 </template> {{ SeeInfoDialogData.updateTime }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 图片 </template>
                <div>
                    <el-image v-if="SeeInfoDialogData.picture"  :src="SeeInfoDialogData.picture" class="avatar" :fit="fill"
                        :preview-src-list="[SeeInfoDialogData.picture]" />
                    <el-image v-else :src="defaultPicture" class="avatar" :fit="fill" :preview-src-list="[defaultPicture]" />
                </div>
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 介绍 </template>
                <el-input v-model="SeeInfoDialogData.introduction" :rows="9" type="textarea" disabled />
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>

<style scoped>
.avatar {
    width: 225px;
    height: 200px;
    display: block;
}
</style>
