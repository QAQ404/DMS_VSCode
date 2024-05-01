<script setup>
import { ref, provide, onActivated } from 'vue';
import { Promotion, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const backMainVue = () => {
    router.back();
}

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const emailData = ref({
    reId: '',
    theme: '',
    content: ''
})

import { userGetListService } from '@/api/user.js'
const userList = ref([])
const getUserList = async () => {
    let result = await userGetListService();
    userList.value = result.data;
}

const qui = ref()
const sendEmail = () => {
    console.log(emailData.value);
    console.log(qui.value);
    ElMessageBox.confirm(
        '是否确认发送',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
                
            ElMessage({
                type: 'success',
                message: '成功发送',
            })
            emailData.value = ref({ reId: '', theme: '', content: '' }).value;
            qui.value.setHTML('');
            router.push({ name: 'main' })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消发送',
            })
        })
}


onActivated(() => {
    getUserList()
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <el-page-header @back="backMainVue">
                    <template #content>
                        <span> 新邮件 </span>
                    </template>
                </el-page-header>
            </div>
        </template>

        <el-space>
            <span>收信人：</span>
            <el-cascader :options="userList" style="width: 785px;" v-model="emailData.reId" filterable
                :show-all-levels="false">
                <template #default="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
            </el-cascader>
        </el-space>
        <el-space style="margin-top: 5px;">
            <span>主题：</span>
            <el-input v-model="emailData.theme" style="width: 800px;" />
        </el-space>
        <div style="margin-top: 5px;">
            <quill-editor theme="snow" ref="qui"
                :toolbar="[{ 'size': ['small', false, 'large', 'huge'] }, { 'font': [] }, 'strike', 'bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }, { 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }]"
                v-model:content="emailData.content" contentType="html" style="height: 280px;">
            </quill-editor>
        </div>
        <div style="margin-top: 5px;">
            <el-button @click="sendEmail" type="primary" :icon="Promotion">发送</el-button>
        </div>
        <div v-html="emailData.content"></div>
    </el-card>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}
</style>
