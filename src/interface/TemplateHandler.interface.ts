/**
 * 组件模板的生命周期
 * 也就是当该模板创建组件时的生命周期钩子会被触发
 * 用于 @Component 注解下的组件模板
 */
export interface TemplateHandler{
    /**
     * 当前模板被创建为组件，但是未进行初始化与依赖注入
     */
    created?:()=>void
    /**
     * 当前模板创建组件实例完成，但可能此时还在创建其他组件
     * 或许其他组件与当前组件无关，但是也有可能存在间接调用
     */
    completed?:()=>void

    /**
     * 准备就绪
     */
    ready:()=>void
}