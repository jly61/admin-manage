<template>
  <div class="tab-container">
    <el-alert
      :closable="false"
      style="width:200px;display:inline-block;vertical-align: middle;"
      title="农业气象服务指标库"
      type="success"/>
    <div class="menu">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="cropFormVisible = true">
        添加指标
      </el-button>
    </div>
    <el-dialog title="添加指标" :visible.sync="cropFormVisible">
      <el-form :model="form">
        <el-form-item label="农作物类型" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="请选择农作物类型">
            <el-option label="水稻" value="水稻"></el-option>
            <el-option label="冬小麦" value="冬小麦"></el-option>
            <el-option label="玉米" value="玉米"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生长时期" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：发芽期" placement="top-start">
            <el-input v-model="form.period" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="最低温度(°C)" prop="pass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：10" placement="top-start">
            <el-input v-model="form.min_temp" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="最高温度(°C)" prop="reSass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：30" placement="top-start">
            <el-input v-model="form.max_temp" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="适宜温度(°C)" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：14-25" placement="top-start">
            <el-input v-model="form.suit" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="指标描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">添 加</el-button>
      </div>
    </el-dialog>
    <!--编辑弹出form-->
    <el-dialog title="编辑指标" :visible.sync="editFormVisible">
      <el-form :model="editForm">
        <el-form-item label="农作物类型" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="请选择农作物类型">
            <el-option label="水稻" value="水稻"></el-option>
            <el-option label="冬小麦" value="冬小麦"></el-option>
            <el-option label="玉米" value="玉米"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生长时期" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：发芽期" placement="top-start">
            <el-input v-model="editForm.period" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="最低温度(°C)" prop="pass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：10" placement="top-start">
            <el-input v-model="editForm.min_temp" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="最高温度(°C)" prop="reSass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：30" placement="top-start">
            <el-input v-model="editForm.max_temp" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="适宜温度(°C)" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：14-25" placement="top-start">
            <el-input v-model="editForm.suit" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="指标描述" :label-width="formLabelWidth">
          <el-input v-model="editForm.desc" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">修 改</el-button>
      </div>
    </el-dialog>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.label">
        <keep-alive>
          <tab-pane v-if="activeName===item.label" @create="showCreatedTimes" @sendEdit="showEditForm"/>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import tabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '水稻', key: 'rice' },
        { label: '冬小麦', key: 'wheat' },
        { label: '玉米', key: 'corn' }
      ],
      form: {
        'name': '',
        'period': '',
        'min_temp': null,
        'max_temp': null,
        'suit': '',
        'desc': ''
      },
      formLabelWidth: '100px',
      editForm: {},
      cropFormVisible: false, // 添加指标框控制
      editFormVisible: false, // 添加指标框控制
      activeName: '水稻',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    handleAdd() {
      axios.post('http://localhost:3000/crops/add', this.form).then(res => {
        if (res.status === 200) {
          console.log(res)
        }
      })
    },
    showEditForm(rowInfo) {
      this.editForm = rowInfo
      console.log(this.editForm)
      this.editFormVisible = true
    },
    handleEdit() {}
  }
}
</script>

<style lang="stylus" scoped>
  .tab-container
    margin 30px
  .menu
    margin-top 20px
</style>
