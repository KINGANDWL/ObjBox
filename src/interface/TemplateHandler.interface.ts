/**
 * 组件模板的生命周期
 * 也就是当该模板创建组件时的生命周期钩子会被触发
 * 用于 @Component 注解下的组件模板
 */
export interface TemplateHandler{
    /**
     * 组件刚刚被创建完成
     */
    created?:()=>void
    /**
     * 当前组件完成注入（基本可以使用）
     */
    completed?:()=>void

    /**
     * 一切准备就绪
     */
    ready:()=>void
    
    /**
     * 即将被卸载
     */
    unload?:()=>Promise<void>
}