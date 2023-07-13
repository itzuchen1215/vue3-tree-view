import { createInjectionState } from '@vueuse/shared';
import { reactive, ref, toRaw, watch } from 'vue';
import type { ITree, ITreeFlatList, ITreeInitValue } from './types';

const [
  useProvideTreeViewStore,
  useTreeViewStore
] = createInjectionState((initialValue: ITreeInitValue) => {

  const selectedId = ref(initialValue.selectedId);
  const expandedIds = ref<(string | null)[]>([]);
  const expandedIdsMap = reactive(new Map());
  const flatList = ref<ITreeFlatList[]>([]);

 
  function getFlatList(treeData: ITree[], parentId: string | null = null, level = 0) {
    let list: ITreeFlatList[] = [];
    const levelCount = level;
    const data = structuredClone(toRaw(treeData));
  
    for (const item of data) {
      if (!item) {
        break;
      }

      const hasChidren: boolean = (item.children && item.children.length > 0) || false;

      const flatArrItem: ITreeFlatList = {
        id: item.id,
        label: item.label,
        parentId,
        level,
        hasChidren,
      };
  
      list.push(flatArrItem);
  
      if (hasChidren) {
        const children = getFlatList(item.children!, item.id, levelCount+1);
        list = list.concat(children);
      }
    }
    return list;
  }
  flatList.value = getFlatList(initialValue.treeData);

  // actions
  function setSelectedId(id: string | null) {
    selectedId.value = id;
  }

  function toggleExpandedIds(id: string | null, level: number) {
    if (expandedIds.value[level] === id) {
      expandedIds.value[level] = null;
      return;
    }
    expandedIds.value[level] = id;
  }

  function setExpandedIdsMapping(id: string | null) {
    if (!id) {
      return;
    }
    expandedIdsMap.set(id, structuredClone(toRaw(expandedIds.value)));
  }

  function getExpandedIdsFromMap(id: string | null) {
    if (!id || !expandedIdsMap.has(id)) {
      return;
    }
    return expandedIdsMap.get(id);
  }

  function getSelectedItem(id: string | null) {
    return flatList.value.find(item => item.id === id);
  }

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


  return {
    selectedId,
    expandedIds,
    setSelectedId,
    toggleExpandedIds,
    setExpandedIdsMapping,
    getExpandedIdsFromMap,
    findExpandedIdsFromSelectedId,
    getSelectedItem,
  }
})

export { useProvideTreeViewStore }
export { useTreeViewStore }