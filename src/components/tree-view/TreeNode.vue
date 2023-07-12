<script setup lang="ts">
import type { PropType } from 'vue';
import type { ITreeNode } from './types';
import IconExpanded from '@/components/icons/IconExpanded.vue';


const emit = defineEmits(['clickNode'])

const props = defineProps({
  node: {
    type: Object as PropType<ITreeNode>,
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
  expended: {
    type: Boolean,
    default: false,
  },
});

function handleClickNode() {
  emit('clickNode', {
    id: props.node.id,
    hasChidren: props.hasChidren,
  })
}

</script>

<template>
  <li
    :class="['tree-list', { expended }, { selected }]"
    :data-node-id="node.id"
  >
    <div class="tree-node" @click="handleClickNode">
      <div class="tree-node__icon">
        <IconExpanded
          v-show="hasChidren"
        />
      </div>
      <span class="tree-node__label">{{ node.label || node.id }} | {{ node.id }}</span>
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

.expended {
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
