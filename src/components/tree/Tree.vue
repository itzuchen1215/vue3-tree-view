<script setup lang="ts">
import { ref, type PropType, computed, toRaw, watch } from 'vue';
import TreeList from '@/components/tree/TreeList.vue';
// import { useProvideTreeViewStore } from '@/components/tree/treeStore';
import type { ITree } from './types';
import { useProvideTreeViewStore } from './treeStore';

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
  expendedIds,
  updateSelectedId,
} = useProvideTreeViewStore({
  treeData: props.treeData,
  selectedId: props.modelValue,
  expendedIds: [],
});

// TODO: bind v-model
console.log(props.modelValue);
watch(() => props.modelValue, (id: string | null) => {
  console.log(id);
  selectedId.value = id;
}, {immediate: true});

// const selectedId = computed({
//   get() {
//     return props.modelValue
//   },
//   set(value) {
//     emit('update:modelValue', value || null)
//   }
// })


</script>

<template>
  <TreeList :tree-data="treeData" />
</template>

<style lang="scss" scoped>

</style>