import { Annotations } from '../../annotation/Annotations';

/**
 * 被创建的组件
 */
export interface ComponentInterface {
    //注解信息
    _annotations_: Annotations
    //自己被依赖注入的上一层组件
    _preComponents_: ComponentInterface[]
}