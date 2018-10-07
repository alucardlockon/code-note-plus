<template>
    <div>
        <div>
            <el-button-group>
                <el-button icon="el-icon-plus"></el-button>
                <el-button icon="el-icon-edit"></el-button>
                <el-button icon="el-icon-delete"></el-button>
                <el-button icon="el-icon-arrow-up"></el-button>
                <el-button icon="el-icon-arrow-down"></el-button>
            </el-button-group>
            <el-button-group style="float: right">
                <el-button icon="el-icon-caret-right" type="primary" @click="$emit('run')"></el-button>
                <el-button icon="el-icon-check" type="primary" @click="fileSave"></el-button>
            </el-button-group>
        </div>
        <div v-for="step in data.steps" style="margin-top: 3px">
            <el-button style="width: 100%" @click="itemClick(step)">{{step.name}}</el-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'workflow-view',
    props: {
      data: {
        type: Object
      },
      click: {
        type: Function
      }
    },
    data () {
      return {
        selection: ''
      }
    },
    methods: {
      itemClick: function (step) {
        this.selection = step
        // this.$router.push({name: 'step-' + step.type, params: {config: {host: '127.0.0.1'}}})
        this.$emit('item-click', step)
      },
      fileSave: function () {
        this.$emit('fileSave')
      }
    }
  }
</script>

<style scoped>

</style>