<script setup lang="ts">
import { type PropType, watch, ref } from 'vue';
import TreeList from '@/components/tree/TreeList.vue';
import type { ITree } from './types';
import { useProvideTreeViewStore } from './treeStore';

const emit = defineEmits<{
  (e: 'update:modelValue', id: string | null): void
}>();

const props = defineProps<{
  modelValue: string | null
  treeData: ITree[]
}>();

const {
  setSelectedId,
  expandedIds,
  getExpandedIdsFromMap,
  setExpandedIdsMapping,
  getSelectedItem,
} = useProvideTreeViewStore({
  treeData: props.treeData,
  selectedId: props.modelValue,
});

const clickFlag = ref(false);

watch(() => props.modelValue, (id: string | null) => {
  setSelectedId(id);

  if (clickFlag.value) {
    clickFlag.value = false;
    return;
  }

  // auto expand node without click
  const ids: (string | null)[] = getExpandedIdsFromMap(id);
  if (!ids) {
    findExpandedIdsFromSelectedId(id);
  } else {
    const selectedItem = getSelectedItem(id);
    ids.forEach((value, idx) => {
      if (selectedItem && idx <= selectedItem.level) {
        expandedIds.value[idx] = value;
      }
    });
  }
  setExpandedIdsMapping(id);

}, {immediate: true});

function findExpandedIdsFromSelectedId(id: string | null) {
  const selectedItem = getSelectedItem(id);
  if (!selectedItem) {
    return;
  }
  if (selectedItem.level === 0) {
    expandedIds.value[selectedItem.level] = id;
    return;
  }
  const expandIds = new Array(selectedItem.level + 1).fill(null);
  let parentId = selectedItem.hasChidren ? selectedItem.id : selectedItem.parentId;
  for(let i = 0; i <= selectedItem.level; i++) {
    const parentItem = getSelectedItem(parentId);
    if (parentItem) {
      parentId = parentItem?.parentId;
      expandIds[parentItem?.level] = parentItem?.id;
    }
  }
  expandIds.forEach((ids, index) => expandedIds.value[index] = ids);
}

function handleClickNode(id: string | null) {
  clickFlag.value = true;
  emit('update:modelValue', id);
}

</script>

<template>
  <TreeList
    :tree-data="treeData"
    @clickNode="handleClickNode"
  />
</template>

<style lang="scss" scoped>

</style>