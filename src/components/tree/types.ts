export interface ITree {
  id: string;
  label: string | null;
  children?: ITree[];
}

export type ITreeNode = Omit<ITree, 'children'>;

export interface ITreeInitValue {
  treeData: ITree[];
  selectedId: string | null;
  expendedIds?: (string | null)[];
}

export interface ITreeFlatList {
  id: string;
  label: string | null;
  parentId: string | null;
  level: number;
  hasChidren: boolean;
}
