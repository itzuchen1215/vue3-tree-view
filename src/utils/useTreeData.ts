import { type ITree, type ITreeNode } from "@/components/tree-view/types"
import { ref, toRaw } from "vue";

const defaultList: ITree[] = [
  {
    id: '64f',
    label: '好喝黑糖',
    children: [
      {
        id: '445',
        label: '黑糖鮮奶',
        children: [
          {
            id: '37a',
            label: '黑糖珍珠鮮奶',
          },
          {
            id: 'feb',
            label: '黑糖芋圓鮮奶',
          },
          {
            id: '59c',
            label: '黑糖蒟蒻鮮奶',
          }
        ],
      },
      {
        id: '29e',
        label: '黑糖冬瓜',
        children: [
          {
            id: 'ac3',
            label: '黑糖冬瓜牛奶',
          },
          {
            id: 'ca0',
            label: '黑糖冬瓜珍珠',
          }
        ],
      }
    ],
  },
  {
    id: '6c3',
    label: '茶',
    children: [
      {
        id: '5dc',
        label: '烏龍綠',
      },
      {
        id: 'b5f',
        label: '綠茶',
      },
      {
        id: 'b09',
        label: '紅茶',
      },
      {
        id: '887',
        label: '青茶',
      }
    ],
  },
  {
    id: 'c81',
    label: '咖啡',
    children: [
      {
        id: 'e02',
        label: '黑咖啡',
        children: [
          {
            id: 'd20',
            label: '濃縮咖啡',
          },
          {
            id: '1f8',
            label: '美式咖啡',
          }
        ],
      },
      {
        id: 'd7a',
        label: '牛奶咖啡',
        children: [
          {
            id: 'c09',
            label: '拿鐵',
            children: [
              {
                id: 'db2',
                label: '黑糖拿鐵',
              },
              {
                id: '9f6',
                label: '榛果拿鐵',
              },
              {
                id: 'b61',
                label: '香草拿鐵',
              }
            ],
          },
          {
            id: '9ac',
            label: '卡布奇諾',
          },
          {
            id: 'ce8',
            label: '摩卡',
          }
        ],
      }
    ],
  }
];

interface ISelectList {
  id: string;
  label: string | null;
  parentId: string | null;
  level: number;
}

export function useTreeView() {
  const treeData = ref<ITree[]>(defaultList);
  const treeDepth = ref<number>(0);
  const selectList = ref<ISelectList[]>([]);
  const treeLevelMap = ref<any[]>([]);

  function getSelectList(treeData: ITree[], parentId: string | null = null, level = 0) {
    let list: ISelectList[] = [];
    const levelCount = level;
  
    for (const item of treeData) {
      const flatItem: ISelectList = {
        id: item.id,
        label: item.label,
        parentId,
        level,
      };
  
      list.push(flatItem);
  
      if (item.children && item.children.length > 0) {
        const children = getSelectList(item.children, item.id, levelCount+1);
        list = list.concat(children);
      }
    }
    return list;
  }

  function updateExpendIdsBySelectedId(list: ISelectList[], selectedId: string) {
    const targetItem = list.find(item => item.id === selectedId);
    if (!targetItem) {
      return;
    }
    if (targetItem.level === 0) {

    }
  }

  function getTreeDepth(data: ITree[]) {
    if (!data || data.length === 0) {
      return 0;
    }

    let depth = 0;
    const queueArr = structuredClone(toRaw(data));

    while (queueArr.length > 0) {
      const levelSize = queueArr.length;
      for (let i = 0; i < levelSize; i++) {
        const node = queueArr.shift();
        if (node && node.children && node.children.length > 0) {
          queueArr.push(...node.children);
        }
      }
      depth++;
    }
    return depth;
  }

  
  treeDepth.value = getTreeDepth(treeData.value);
  selectList.value = getSelectList(treeData.value);

  return {
    treeData,
    treeDepth,
  }
}