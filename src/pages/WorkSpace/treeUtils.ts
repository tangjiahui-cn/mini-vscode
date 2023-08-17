/**
 * 操作TreeData的方法
 */

// 删除treeData中的一个节点
export function deleteTreeNode (treeData: any[] = [], key: string = '') {
  return treeData.filter(x => {
    x.children = deleteTreeNode(x?.children, key);
    return x.key !== key
  })
}

// 在treeData中找到指定节点
export function getTreeNode(treeData: any[] = [], key: string = '') {
  for (let i = 0; i < treeData.length; i ++) {
    const treeNode = treeData[i]
    if (treeNode?.key === key) return treeNode;
    else {
      const node = getTreeNode(treeNode?.children, key)
      if (node) return node;
    }
  }
  return null
}


/**
 * 添加children给treeData中指定key的节点（修改treeData数组）
 *
 * @param treeData  treeData
 * @param key   父级的key
 * @param children 父级key需要附件的children
 */
export function appendChildren (treeData: any[] = [], key = '', children: any[] = []) {
  for (let i = 0; i < treeData.length; i++) {
    const o: any = treeData[i]
    if (o?.key === key) {
      o.children = children
      o.isLeaf = !children.length
      return true
    } else {
      if (appendChildren(o?.children, key, children)) return true
    }
  }
  return false
}


/**
 * 删除TreeData中的数据（修改treeData数组）
 * @param treeData
 * @param key 要删除key值的data
 */

export function deleteData (treeData: any[], key: string, parent?: any) {
  if (!treeData?.length) return false
  for (let i = 0; i < treeData.length; i++) {
    const o = treeData[i]
    if (o?.key === key) {
      if (parent) {
        parent.children = treeData.filter(x => x?.key !== key)
        if (!parent.children?.length) {
          parent.isLeaf = true
        }
      }
      return true
    } else {
      if (deleteData(o?.children || [], key, o)) return true
    }
  }
  return false
}

/**
 * 给treeData中指定key的节点的children插入一个新的节点
 *
 * @param treeData  treeData
 * @param key   父级的key
 * @param children 父级key需要附件的children
 */
export function insertNode (treeData: any[] = [], key = '', node: any) {
  for (let i = 0; i < treeData.length; i++) {
    const o: any = treeData[i]
    if (o?.key === key) {
      if (o.children) o.children.push(node)
      else o.children = [node]
      o.isLeaf = false
      return true
    } else {
      if (insertNode(o?.children, key, node)) return true
    }
  }
  return false
}
