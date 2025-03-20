/**
 * 检查用户是否有权限
 * @param {Array} roles 用户角色
 * @param {Array} permittedRoles 允许的角色
 * @returns {Boolean}
 */
export function hasPermission(roles, permittedRoles) {
  if (!roles || !permittedRoles) return false
  if (permittedRoles.includes('*')) return true
  return roles.some(role => permittedRoles.includes(role))
}

/**
 * 过滤有权限的路由
 * @param {Array} routes 路由
 * @param {Array} roles 用户角色
 * @returns {Array}
 */
export function filterRoutes(routes, roles) {
  const result = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    
    if (hasPermission(roles, tmp.meta?.roles)) {
      if (tmp.children) {
        tmp.children = filterRoutes(tmp.children, roles)
      }
      result.push(tmp)
    }
  })
  
  return result
} 