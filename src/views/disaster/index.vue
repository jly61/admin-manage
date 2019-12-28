<template>
  <div class="tab-container">
    <el-alert
      :closable="false"
      style="width:200px;display:inline-block;vertical-align: middle;"
      title="气象灾害指标库"
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
        <el-form-item label="气象灾害类型" :label-width="formLabelWidth">
          <el-select v-model="form.disaster_type" placeholder="请选择灾害类型">
            <el-option label="霜冻" value="霜冻"></el-option>
            <el-option label="高温" value="高温"></el-option>
            <el-option label="暴雨" value="暴雨"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警级别" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：蓝色预警" placement="top-start">
            <el-input v-model="form.level" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="时间指标(h)" prop="pass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：10" placement="top-start">
            <el-input v-model="form.time" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="气象要素指标" prop="reSass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：36" placement="top-start">
            <el-input v-model="form.element" autocomplete="off"></el-input>
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
        <el-form-item label="气象灾害类型" :label-width="formLabelWidth">
          <el-select v-model="form.disaster_type" placeholder="请选择灾害类型">
            <el-option label="霜冻" value="霜冻"></el-option>
            <el-option label="高温" value="高温"></el-option>
            <el-option label="暴雨" value="暴雨"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警级别" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：蓝色预警" placement="top-start">
            <el-input v-model="editForm.level" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="时间指标(h)" prop="pass" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" content="如：10" placement="top-start">
            <el-input v-model="editForm.time" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
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
        { label: '霜冻', key: 'rice' },
        { label: '高温', key: 'wheat' },
        { label: '暴雨', key: 'corn' }
      ],
      form: {
        'disaster_type': '',
        'level': '',
        'time': null,
        'element': null,
        'desc': ''
      },
      formLabelWidth: '100px',
      editForm: {},
      cropFormVisible: false, // 添加指标框控制
      editFormVisible: false, // 添加指标框控制
      activeName: '霜冻',
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
      axios.post('http://localhost:3000/disasters/add', this.form).then(res => {
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
