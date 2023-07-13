<script setup lang="ts">
import { type PropType, watch } from 'vue';
import TreeList from '@/components/tree/TreeList.vue';
import type { ITree } from './types';
import { useProvideTreeViewStore } from './treeStore';

const emit = defineEmits<{
  'update:modelValue': [id: string | null]
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
  updateSelectedId,
} = useProvideTreeViewStore({
  treeData: props.treeData,
  selectedId: props.modelValue,
});


watch(() => props.modelValue, (id: string | null) => {
  updateSelectedId(id);
}, {immediate: true});

function handleClickNode(id: string | null) {
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