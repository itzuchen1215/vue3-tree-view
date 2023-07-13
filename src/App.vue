<script setup lang="ts">
import { ref, watch } from 'vue';
import TreeView from './components/tree/TreeView.vue';
import { useTreeData } from '@/utils/useTreeData';
import { useTreeStorage } from '@/utils/useTreeStorage';

const {
  treeData,
  selectList,
  getTreeData
} = useTreeData();

const {
  setSelectedIdLocalStorage,
  getSelectedIdLocalStorage,
} = useTreeStorage();

const selectedId = ref<string | null>(null);

function getInitId() {
  if (getSelectedIdLocalStorage()) {
    selectedId.value = getSelectedIdLocalStorage();
  }
}

watch(selectedId, (id: string | null) => {
  if (id) {
    setSelectedIdLocalStorage(id);
  }
});

getInitId();
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
    <TreeView
      v-if="treeData.length > 0"
      :tree-data="treeData"
      v-model="selectedId"
    />
  </div>
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
</style>