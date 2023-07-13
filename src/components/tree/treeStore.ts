import { createInjectionState } from '@vueuse/shared';
import { reactive, ref, toRaw, watch } from 'vue';
import type { ITree, ITreeFlatList, ITreeInitValue } from './types';

const [
  useProvideTreeViewStore,
  useTreeViewStore
] = createInjectionState((initialValue: ITreeInitValue) => {
  // state
  const selectedId = ref(initialValue.selectedId);
  const expendedIds = ref<(string | null)[]>([]);
  const expendedIdsMap = reactive(new Map());
  const flatList = ref<ITreeFlatList[]>([]);

  // getters
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
  function updateSelectedId(id: string | null) {
    selectedId.value = id;
  }

  function updateExpendedIds(id: string | null, level: number) {
    if (expendedIds.value[level] === id) {
      expendedIds.value[level] = null;
      return;
    }
    expendedIds.value[level] = id;
  }

  function setExpendedIdsMapping(id: string | null) {
    expendedIdsMap.set(id, structuredClone(toRaw(expendedIds.value)));
  }

  function getExpendedIdsFromMap(id: string | null) {
    if (!expendedIdsMap.has(id)) {
      return;
    }
    return expendedIdsMap.get(id);
  }

  function findExpendedIdsFromSelectedId(id: string | null) {
    const selectedItem = flatList.value.find(item => item.id === id);
    if (!selectedItem) {
      return; // error handler
    }
    if (selectedItem.level === 0) {
      expendedIds.value[selectedItem.level] = id;
      return;
    }
    const expendIds = new Array(selectedItem.level + 1).fill(null);
    let parentId = selectedItem.hasChidren ? selectedItem.id : selectedItem.parentId;
    for(let i = 0; i <= selectedItem.level; i++) {
      const parentItem = flatList.value.find(item => item.id === parentId);
      if (parentItem) {
        parentId = parentItem?.parentId;
        expendIds[parentItem?.level] = parentItem?.id;
      }
    }
    expendIds.forEach((ids, index) => expendedIds.value[index] = ids);
  }

  
  watch(selectedId, (id: string | null) => {
    const ids: (string | null)[] = getExpendedIdsFromMap(id);
    if (!ids) {
      findExpendedIdsFromSelectedId(id);
    } else {
      ids.forEach((id, index) => expendedIds.value[index] = id);
    }
    setExpendedIdsMapping(id);
  }, {immediate: true});


  return {
    selectedId,
    expendedIds,
    updateSelectedId,
    updateExpendedIds,
    setExpendedIdsMapping,
  }
})

export { useProvideTreeViewStore }
// If you want to hide `useTreeViewStore` and wrap it in default value logic or throw error logic, please don't export `useTreeViewStore`
export { useTreeViewStore }