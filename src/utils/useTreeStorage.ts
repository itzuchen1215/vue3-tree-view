export function useTreeStorage() {
  const treeIdKey = 'itzu_tree-id'

  function setSelectedIdLocalStorage(id: string) {
    if (!id) {
      return
    }
    localStorage.setItem(treeIdKey, id)
  }

  function getSelectedIdLocalStorage(): string | null {
    return localStorage.getItem(treeIdKey)
  }

  // function clearLocalStorage() {
  //   localStorage.removeItem(treeIdKey);
  // };

  return {
    setSelectedIdLocalStorage,
    getSelectedIdLocalStorage
  }
}
