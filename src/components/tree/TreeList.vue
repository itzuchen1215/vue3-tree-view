<script setup lang="ts">
import type { PropType } from 'vue';
import TreeNode from './TreeNode.vue';
import type { ITree } from './types';
import { useTreeViewStore } from '@/components/tree/treeStore';

const {
  selectedId,
  expendedIds,
} = useTreeViewStore()!;

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


</script>

<template>
<ul :class="{ 'tree' : level === 0 }">
  <template v-for="{ id, label, children } in treeData" :key="id">
    <TreeNode
      :node="{ id, label }"
      :hasChidren="!!children"
      :level="level"
      :selected="isSelected(id)"
      :expended="isExpend(id)"
    >
      <template #default v-if="children">
        <transition name="tree-chidren">
          <TreeList
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
