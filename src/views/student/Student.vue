<script setup>

import { Edit, Delete, Plus, Search, Refresh,View } from '@element-plus/icons-vue'
import { ref, provide } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudentListService,getStudentByIdService } from '@/api/student.js'
import { useRouter } from 'vue-router';
const router = useRouter();

const nationList = ref([
  {
    "id": "01",
    "name": "汉族"
  },
  {
    "id": "02",
    "name": "蒙古族"
  },
  {
    "id": "03",
    "name": "回族"
  },
  {
    "id": "04",
    "name": "藏族"
  },
  {
    "id": "05",
    "name": "维吾尔族"
  },
  {
    "id": "06",
    "name": "苗族"
  },
  {
    "id": "07",
    "name": "彝族"
  },
  {
    "id": "08",
    "name": "壮族"
  },
  {
    "id": "09",
    "name": "布依族"
  },
  {
    "id": "10",
    "name": "朝鲜族"
  },
  {
    "id": "11",
    "name": "满族"
  },
  {
    "id": "12",
    "name": "侗族"
  },
  {
    "id": "13",
    "name": "瑶族"
  },
  {
    "id": "14",
    "name": "白族"
  },
  {
    "id": "15",
    "name": "土家族"
  },
  {
    "id": "16",
    "name": "哈尼族"
  },
  {
    "id": "17",
    "name": "哈萨克族"
  },
  {
    "id": "18",
    "name": "傣族"
  },
  {
    "id": "19",
    "name": "黎族"
  },
  {
    "id": "20",
    "name": "傈僳族"
  },
  {
    "id": "21",
    "name": "佤族"
  },
  {
    "id": "22",
    "name": "畲族"
  },
  {
    "id": "23",
    "name": "高山族"
  },
  {
    "id": "24",
    "name": "拉祜族"
  },
  {
    "id": "25",
    "name": "水族"
  },
  {
    "id": "26",
    "name": "东乡族"
  },
  {
    "id": "27",
    "name": "纳西族"
  },
  {
    "id": "28",
    "name": "景颇族"
  },
  {
    "id": "29",
    "name": "柯尔克孜族"
  },
  {
    "id": "30",
    "name": "土族"
  },
  {
    "id": "31",
    "name": "达斡尔族"
  },
  {
    "id": "32",
    "name": "仫佬族"
  },
  {
    "id": "33",
    "name": "羌族"
  },
  {
    "id": "34",
    "name": "布朗族"
  },
  {
    "id": "35",
    "name": "撒拉族"
  },
  {
    "id": "36",
    "name": "毛难族"
  },
  {
    "id": "37",
    "name": "仡佬族"
  },
  {
    "id": "38",
    "name": "锡伯族"
  },
  {
    "id": "39",
    "name": "阿昌族"
  },
  {
    "id": "40",
    "name": "普米族"
  },
  {
    "id": "41",
    "name": "塔吉克族"
  },
  {
    "id": "42",
    "name": "怒族"
  },
  {
    "id": "43",
    "name": "乌孜别克族"
  },
  {
    "id": "44",
    "name": "俄罗斯族"
  },
  {
    "id": "45",
    "name": "鄂温克族"
  },
  {
    "id": "46",
    "name": "崩龙族"
  },
  {
    "id": "47",
    "name": "保安族"
  },
  {
    "id": "48",
    "name": "裕固族"
  },
  {
    "id": "49",
    "name": "京族"
  },
  {
    "id": "50",
    "name": "塔塔尔族"
  },
  {
    "id": "51",
    "name": "独龙族"
  },
  {
    "id": "52",
    "name": "鄂伦春族"
  },
  {
    "id": "53",
    "name": "赫哲族"
  },
  {
    "id": "54",
    "name": "门巴族"
  },
  {
    "id": "55",
    "name": "珞巴族"
  },
  {
    "id": "56",
    "name": "基诺族"
  }
]
)
const nationValue = ref("汉族")
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

const searchData = ref({})  //搜索栏数据
const studentList = ref([])
const getStudentList = async () => {
  let params = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    prop: sortData.value.prop ? sortData.value.prop : null,
    order: sortData.value.order ? sortData.value.order : null,
    name: searchData.value.name ? searchData.value.name : null,
  }
  let result = await getStudentListService(params);
  pageInfo.value.total = result.data.total;
  studentList.value = result.data.items;
}
getStudentList()
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
const SeeBuildingInfo = (studentId)=>{
  router.push({name:'studentInfo',params:{studentId}})
}
/* ----------------------------------------------------------------------------------------------------------------- */
const PushToAddStudentVue = ()=>{
  router.push({name:'studentAdd'})
}
/* ----------------------------------------------------------------------------------------------------------------- */
const clazzNameForm = (row, column, cellValue, index) => { //表格的方法，格式化展示的数据 
    return cellValue + '班';
}
const dormitoryNameForm = (row,column,cellValue,index)=>{ //格式化寝室名称
  return row.unitNumber+'单元'+row.floorNumber+'楼'+cellValue
}

</script>

<template>
  <el-card style="min-height: 99%;">
    <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <span>学生信息</span>
                <div>
                    <el-button type="primary" plain @click="PushToAddStudentVue" :icon="Plus">添加学生</el-button>
                </div>
            </div>
    </template>
    <!-- 表格主体 -->
    <el-table :data="studentList" style="width: 100%;" border @sort-change="sortChange" tooltip-effect="light">
      <el-table-column label="姓名" prop="name" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="学号" prop="studyId" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="性别" prop="gender" sortable="custom" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="宿舍" prop="buildingName" sortable="custom" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="寝室" prop="dormitoryName" sortable="custom" show-overflow-tooltip :formatter="dormitoryNameForm" width="180"></el-table-column>
      <el-table-column label="年级" prop="entranceYear" sortable="custom" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="学院" prop="insName" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="专业" prop="majorName" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="班级" prop="clazzName" sortable="custom" show-overflow-tooltip :formatter="clazzNameForm" width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="170">
        <template #default="{ row }">
          <el-button-group>
            <el-button color="#626aef" :dark="isDark" plain :icon="View" @click="SeeBuildingInfo(row.id)" />
            <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row.id)" />
            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteInstitute(row.id)" />
          </el-button-group>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20]"
      layout="jumper, total, sizes, prev, pager, next" :total="pageInfo.total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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