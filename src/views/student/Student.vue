<script setup>
import { Edit, Delete, Plus, Refresh, View } from '@element-plus/icons-vue'
import { ref, provide, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudentListService, studentDeleteService } from '@/api/student.js'
import { clazzGetClazzListCascaderService } from '@/api/clazz.js'
import { dormitoryGetDormitoryListCascaderService } from '@/api/dormitory.js'
import { useRouter } from 'vue-router';
const router = useRouter();
const clazzList = ref([])
const getClazzList = async () => {
  let result = await clazzGetClazzListCascaderService();
  clazzList.value = result.data;
}
getClazzList()

const dormitoryList = ref([])
const getDormitoryList = async () => {
  let result = await dormitoryGetDormitoryListCascaderService();
  dormitoryList.value = result.data;
}
getDormitoryList()

const pageInfo = ref({  //分页条的信息
  pageNum: 1,
  pageSize: 5,
  total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
  pageInfo.value.pageSize = size;
  getStudentList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
  pageInfo.value.pageNum = num;
  getStudentList();
}
const sortData = ref({  //选择排序的数据
  prop: '',
  order: ''
})
const tagData = ref([
  { label: '姓名', value: '', data: [], ifShow: false, old: '', popoverVisible: false, inputType: 1, index: 0 },
  { label: '学号', value: '', data: [], ifShow: false, old: '', popoverVisible: false, inputType: 1, index: 1 },
  { label: '性别', value: '', data: [], ifShow: false, old: '', popoverVisible: false, inputType: 2, index: 2 },
  { label: '年级', value: '', data: [], ifShow: false, old: '', popoverVisible: false, inputType: 3, index: 3 },
  { label: '寝室', value: '', data: [], ifShow: false, old: '', popoverVisible: false, inputType: 4, index: 4 },
  { label: '班级', value: '', data: [], ifShow: false, old: '', popoverVisible: false, inputType: 5, index: 5 },
])
const searchData = ref({})  //搜索栏数据
const studentList = ref([])
const getStudentList = async () => {
  let params = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    prop: sortData.value.prop ? sortData.value.prop : null,
    order: sortData.value.order ? sortData.value.order : null,
    name: tagData.value[0].value ? tagData.value[0].value : null,
    studyId: tagData.value[1].value ? tagData.value[1].value : null,
    gender: tagData.value[2].value ? tagData.value[2].value : null,
    entranceYear: tagData.value[3].value ? tagData.value[3].value : null,
    dormitoryList: tagData.value[4].data ? tagData.value[4].data : null,
    clazzList: tagData.value[5].data ? tagData.value[5].data : null,
  }
  let result = await getStudentListService(params);
  pageInfo.value.total = result.data.total;
  studentList.value = result.data.items;
}

const sortChange = (data) => {  //排序选择
  if (data.order === null) {
    sortData.value.prop = '';
    sortData.value.order = '';
  } else {
    sortData.value.prop = data.prop;
    sortData.value.order = data.order;
  }
  getStudentList();
}


/* -------------------------------------------查看详情-------------------------------------------------------------- */
const SeeBuildingInfo = (studentId) => {
  router.push({ name: 'studentInfo', params: { studentId } })
}
/* --------------------------------------------批量添加页面----------------------------------------------------------------- */
const PushToAddStudentVue = () => {
  router.push({ name: 'studentAdd' })
}
/* ----------------------------------------修改页面------------------------------------------------------------------------- */
const GoToUpdateVue = (studentId) => {
  router.push({ name: 'studentUpdate', params: { studentId } })
}
/* ----------------------------------------删除学生-------------------------------------------------------------- */
const DeleteStudent = (id) => {
  ElMessageBox.confirm(
    '是否确认删除',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let result = await studentDeleteService(id);
      ElMessage({
        type: 'success',
        message: '成功删除',
      })
      getStudentList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
/* --------------------------表格信息格式化---------------------------------------------------------------------------- */

const clazzNameForm = (row, column, cellValue, index) => { //表格的方法，格式化展示的数据 
  return row.clazzYear + '级' + cellValue + '班';
}
const dormitoryNameForm = (row, column, cellValue, index) => { //格式化寝室名称
  return row.unitNumber + '单元' + row.floorNumber + '楼' + cellValue
}
/* -------------------------------多选----------------------------------------------------------------------- */
const SelectAddStudentList = ref([])
const SelectAddStudentRef = ref()
const handleSelectionChange = (val) => {
  SelectAddStudentList.value = val
}
const selectMany = () => {
  console.log(SelectAddStudentList.value);
}
const getRowKeys = (row) => {
  return row.id;
}
/* -----------------------------搜索------------------------------------------------------------------------- */
const handleClose = (tag) => { //删除标签
  tag.ifShow = false; tag.popoverVisible = false;
  tag.value = '';  tag.data = [];
  getStudentList();
}
const addSearchTag = (command) => { //添加标签
  tagData.value[command].ifShow = true;
  tagData.value[command].value = ''; 
  tagData.value[command].data = [];
  getStudentList();
}
const clearSearchData = () => {  //清空搜索框
  for (const i of tagData.value) { i.ifShow = false; i.popoverVisible = false; i.value = ''; i.data = [] }
  getStudentList();
}
const changeTag = (tag) => { //展示输入框
  tag.old = tag.value;
  tag.popoverVisible = true;
}
const doSearch = (tag) => { //确定按钮，搜索
  tag.popoverVisible = false;
  getStudentList();
}
const doBack = (tag) => { //取消修改,回到上一步
  tag.value = tag.old;
  tag.popoverVisible = false;
}
const clazzCascaderChange = (tag) => {
  getStudentList();
}
const DormitoryCascaderChange = (tag) => {
  getStudentList();
}

const prop1 = { checkStrictly: true }
const prop2 = { multiple: true }
/* ------------------------------------------------------------------------------------------------------ */
onActivated(() => {
  tagData.value[4].data = [];
  tagData.value[5].data = [];
  getStudentList()
  SelectAddStudentRef.value.clearSelection();
})
</script>

<template>
  <el-card style="min-height: 99%;">
    <template #header> <!-- 卡片顶部区域 -->
      <div class="card-header">
        <span>学生信息</span>
        <div>
          <el-button type="primary" plain @click="PushToAddStudentVue" :icon="Plus">添加学生</el-button>
          <el-button type="primary" plain @click="selectMany" :icon="Plus">多选</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索栏 -->
    <el-descriptions :column="1" :size="large" border direction="vertical">
      <el-descriptions-item label="自定义搜索">
        <el-space wrap>
          <el-button :icon=" Refresh " type="warning" plain @click=" clearSearchData " size="large"></el-button>
          <el-dropdown trigger="click" placement="right-start" @command=" addSearchTag ">
            <el-button type="primary" plain :icon=" Plus " size="large"></el-button>
            <template #dropdown>
              <el-dropdown-menu style="user-select: none;">
                <el-dropdown-item command="0" :disabled=" tagData[0].ifShow ">姓名</el-dropdown-item>
                <el-dropdown-item command="1" :disabled=" tagData[1].ifShow ">学号</el-dropdown-item>
                <el-dropdown-item command="2" :disabled=" tagData[2].ifShow ">性别</el-dropdown-item>
                <el-dropdown-item command="3" :disabled=" tagData[3].ifShow ">年级</el-dropdown-item>
                <el-dropdown-item command="4" :disabled=" tagData[4].ifShow ">寝室</el-dropdown-item>
                <el-dropdown-item command="5" :disabled=" tagData[5].ifShow ">班级</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tag v-if=" tagData[5].ifShow " @click="changeTag(tagData[5])" closable :disable-transitions=" false "
            @close="handleClose(tagData[5])" size="large" style="height: 40px;">
            <el-cascader :options=" clazzList " style="width: 400px;" v-model=" tagData[5].data " filterable
              :show-all-levels=" false " @change="clazzCascaderChange(tagData[5])" :props=" prop2 "
              collapse-tags clearable>
              <template #default="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if=" !node.isLeaf "> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-tag>
          <el-tag v-if=" tagData[4].ifShow " @click="changeTag(tagData[4])" closable :disable-transitions=" false "
            @close="handleClose(tagData[4])" size="large" style="height: 40px;">
            <el-cascader :options=" dormitoryList " style="width: 400px;" v-model=" tagData[4].data " filterable
                :show-all-levels=" false " @change="DormitoryCascaderChange(tagData[4])" v-if=" tagData[4].inputType === 4 "
                :props=" prop2 " collapse-tags clearable>
                <template #default="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if=" !node.isLeaf "> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
          </el-tag>
          <div v-for=' tag  in  tagData ' :key=" tag ">
            <el-popover :visible=" tag.popoverVisible " placement="bottom" :width=" 200 " style="user-select: none;"
              v-if=" tag.inputType !== 5 && tag.inputType !== 4">
              <el-input v-model=" tag.value " size="small" v-if=" tag.inputType === 1 " style="user-select: none;" />
              <el-select v-model=" tag.value " style="width: 170px;user-select: none;" v-else-if=" tag.inputType === 2 "
                size="small">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
              <el-date-picker v-model=" tag.value " type="year" placeholder="选择年份" value-format="YYYY" style="width:130px"
                size="small" v-else-if=" tag.inputType === 3 " />
              <div style="text-align: right; padding-top: 10px;user-select: none;">
                <el-button size="small" type="info" @click="doBack(tag)">取消</el-button>
                <el-button size="small" type="primary" @click="doSearch(tag)">确认</el-button>
              </div>
              <template #reference>
                <el-tag closable :disable-transitions=" false " @close="handleClose(tag)" @click="changeTag(tag)"
                  v-show=" tag.ifShow " size="large" style="height: 40px;">
                  <div style="display: flex;">
                    {{ tag.label}} : {{tag.value }}</div>
                </el-tag>
              </template>
            </el-popover>
          </div>
        </el-space>
      </el-descriptions-item>
    </el-descriptions>
    <!-- 表格主体 -->
    <el-table ref="SelectAddStudentRef" :data=" studentList " style="width: 100%;" border @sort-change=" sortChange "
      tooltip-effect="light" @selection-change=" handleSelectionChange " :row-key=" getRowKeys ">
      <el-table-column type="selection" width="55" fixed="left" :reserve-selection=' true '></el-table-column>
      <el-table-column label="姓名" prop="name" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="学号" prop="studyId" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="性别" prop="gender" sortable="custom" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="宿舍" prop="buildingName" sortable="custom" show-overflow-tooltip
        width="120"></el-table-column>
      <el-table-column label="寝室" prop="dormitoryName" sortable="custom" show-overflow-tooltip
        :formatter=" dormitoryNameForm " width="180"></el-table-column>
      <el-table-column label="年级" prop="entranceYear" sortable="custom" show-overflow-tooltip
        width="100"></el-table-column>
      <el-table-column label="学院" prop="insName" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="专业" prop="majorName" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="班级" prop="clazzName" sortable="custom" show-overflow-tooltip :formatter=" clazzNameForm "
        width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="170">
        <template #default="{ row }">
          <el-button-group>
            <el-button color="#626aef" :dark=" isDark " plain :icon=" View " @click="SeeBuildingInfo(row.id)" />
            <el-button color="#E6A23C" :dark=" isDark " plain :icon=" Edit " @click="GoToUpdateVue(row.id)" />
            <el-button color="#F56C6C" :dark=" isDark " plain :icon=" Delete " @click="DeleteStudent(row.id)" />
          </el-button-group>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page=" pageInfo.pageNum " v-model:page-size=" pageInfo.pageSize "
      :page-sizes=" [5, 10, 20] " layout="jumper, total, sizes, prev, pager, next" :total=" pageInfo.total "
      @size-change=" onSizeChange " @current-change=" onCurrentChange "
      style="margin-top: 20px; justify-content: flex-end" />
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
}

.input-with {
  width: 100px;
}
</style> 
<!-- <el-select v-model="nationValue" filterable placeholder="请选择民族">
        <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.name"></el-option>
    </el-select> -->