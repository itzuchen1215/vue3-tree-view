<script setup lang="ts">
import type { PropType } from 'vue';
import TreeNode from './TreeNode.vue';
import type { ITree } from './types';
import { useTreeViewStore } from '@/components/tree-view/treeViewStore';
// import { useElementSize } from '@vueuse/core'

// requirement
// 1. 選擇到的要自動展開
// 2. 選擇時要toggle, 同層只能開啟一個父層
// 3. 除了Click, 還可以用其他方式觸發Selected
// 4. 要記錄Selected是哪個id


const {
  selectedId,
  updateSelectedId,
  expendedIds,
  updateExpendedIds,
  setExpendedIdsMapping,
} = useTreeViewStore()!;

// const emit = defineEmits<{
//   (e: 'update:modelValue', id: string | null): void
// }>()

const props = defineProps({
  treeData: {
    type: Array as PropType<ITree[]>,
    default: () => [],
  },
  level: {
    type: Number,
    default: 0,
  },
});


function isExpend (id: string) {
  return expendedIds.value[props.level] === id;
};

function isSelected (id: string) {
  return selectedId.value === id;
};

function handleClickNode({id, hasChidren}: {id: string, hasChidren: boolean}) {
  if (hasChidren) {
    updateExpendedIds(id, props.level);
  }
  setExpendedIdsMapping(id);
  updateSelectedId(id);
}

</script>

<template>
<ul :class="{ 'tree' : level === 0 }">
  <template v-for="{ id, label, children } in treeData" :key="id">
    <TreeNode
      :node="{ id, label }"
      @clickNode="handleClickNode"
      :hasChidren="!!children"
      :data-level="level"
      :selected="isSelected(id)"
      :expended="isExpend(id)"
    >
      <template #default v-if="children">
        <transition name="tree-chidren">
          <TreeView
            v-show="isExpend(id)"
            :style="{ '--tree-children-length': children.length }"
            :treeData="children"
            class="tree-children"
            :level="level + 1"
          />
        </transition>
      </template>
    </TreeNode>
  </template>
</ul>
</template>

<style lang="scss">

.tree-chidren-enter-active,
.tree-chidren-leave-active {
  max-height: calc(var(--tree-node-height) * var(--tree-children-length));
  transition: max-height 0.25s ease-in-out;
}

.tree-chidren-enter-from,
.tree-chidren-leave-to {
  max-height: 0;
}

.tree {
  padding: 6px;
  &-children {
    padding-left: 20px;
    overflow: hidden;
  }
}

</style>
