<script setup lang="ts">
import { ref } from 'vue';
import Tree from './components/tree/Tree.vue';
import { useTreeData } from '@/utils/useTreeData';


const { treeData, selectList, getTreeData } = useTreeData();
const selectedId = ref<string | null>(null);

// simulate async api get list
getTreeData();


</script>

<template>
  <header class="navbar">
    <h1>Vue3 Tree View</h1>
  </header>
  <div class="sidebar">
    <div class="select-box">
      <select class="select" v-model="selectedId">
        <option v-for="{ id, label } in selectList" :key="id" :value="id">
          {{ label }}
        </option>
      </select>
    </div>
    <Tree
      v-if="treeData.length > 0"
      :tree-data="treeData"
      v-model="selectedId"
    />
  </div>
  <main class="main">
    <div class="container">test</div>
  </main>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  font-size: 20px;
  padding: var(--navbar-padding);
  box-shadow: 1px 1px 3px #DDD;
  z-index: 5;
}

.select-box {
  margin: 12px auto;
}
.select {
  width: 100%;
  padding: 4px 8px;
  border-radius: 6px;
}
.sidebar {
  padding: var(--sidebar-padding);
  width: var(--sidebar-width);
  height: calc(100vh - var(--navbar-height));
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 1px 1px 3px #DDD;
  background-color: #FAFAFA;
}

.main {
  width: 100%;
  height: 100vh;
  padding-left: var(--sidebar-width);
  padding-top: var(--navbar-height);
}

.container {
  padding: 12px 16px;
}

</style>