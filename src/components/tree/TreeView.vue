<script setup lang="ts">
import { type PropType, watch, ref } from 'vue';
import TreeList from '@/components/tree/TreeList.vue';
import type { ITree } from './types';
import { useProvideTreeViewStore } from './treeStore';

const emit = defineEmits<{
  (e: 'update:modelValue', id: string | null): void
}>()

const props = defineProps({
  treeData: {
    type: Array as PropType<ITree[]>,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: null,
  },
});

const {
  setSelectedId,
  expandedIds,
  getExpandedIdsFromMap,
  findExpandedIdsFromSelectedId,
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