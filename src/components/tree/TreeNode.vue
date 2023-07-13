<script setup lang="ts">
import type { PropType } from 'vue';
import type { TreeNode } from './types';
import { useTreeViewStore } from './treeStore';
import IconExpanded from '@/components/icons/IconExpanded.vue';


const emit = defineEmits(['clickNode'])

const props = defineProps({
  node: {
    type: Object as PropType<TreeNode>,
    default: () => null,
  },
  hasChidren: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 0,
  }
});

const {
  toggleExpandedIds,
  setExpandedIdsMapping,
} = useTreeViewStore()!;


function handleClickNode() {
  if (props.hasChidren) {
    toggleExpandedIds(props.node.id, props.level);
  }
  setExpandedIdsMapping(props.node.id);
  emit('clickNode', props.node.id);
}

</script>

<template>
  <li
    :class="['tree-list-item', { expanded }, { selected }]"
    :data-node-id="node.id"
    :data-node-level="props.level"
  >
    <div class="tree-node" @click="handleClickNode">
      <div class="tree-node__icon">
        <IconExpanded
          v-show="hasChidren"
        />
      </div>
      <span class="tree-node__label">{{ node.label || node.id }}</span>
    </div>
    <slot />
  </li>
</template>

<style lang="scss" scoped>
.tree-node {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  height: var(--tree-node-height);
  &__icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    transition: 0.3s transform ease-in-out;
    color: var(--tree-icon-color);
  }
  &__label {
    color: var(--tree-label-font-color);
  }
}

.expanded {
  & > .tree-node {
    .tree-node__icon {
      transform: rotate(90deg);
    }
  }
}

.selected {
  & > .tree-node {
    background-color: var(--tree-highlight-bg-color);
    border-radius: 6px;
  }
}
</style>
