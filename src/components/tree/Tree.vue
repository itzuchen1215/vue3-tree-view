<script setup lang="ts">
import { ref, type PropType, computed, toRaw, watch } from 'vue';
import TreeList from '@/components/tree/TreeList.vue';
// import { useProvideTreeViewStore } from '@/components/tree/treeStore';
import type { ITree } from './types';
import { useProvideTreeViewStore } from './treeStore';

const emit = defineEmits(['update:modelValue'])

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
  selectedId,
} = useProvideTreeViewStore({
  treeData: props.treeData,
  selectedId: props.modelValue,
});


watch(() => props.modelValue, (id: string | null) => {
  selectedId.value = id;
}, {immediate: true});

function handleClickNode(id: string | null) {
  emit('update:modelValue', id);
}

</script>

<template>
  <TreeList :tree-data="treeData" @clickNode="handleClickNode" />
</template>

<style lang="scss" scoped>

</style>