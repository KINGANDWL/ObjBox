import { AutowireMethod, AutowireProperty, Bean, BeanComponent, Component, ComponentCreatedType,TemplateHandler } from '../';
import { ComponentScan } from './ComponentScanDemo/ComponentScan.annotation';


// @Component()
// export class DefaultComponent implements TemplateHandler{
//     created(){
//         console.log("DefaultComponent-created")
//     };
//     completed(){
//         console.log("DefaultComponent-completed")
//     };
//     ready(){
//         console.log("DefaultComponent-ready")
//     };
// }


@Component("A")
export class A{

}
@Component()
export class B{

}
@BeanComponent()
export class MyBeanComponent{
    @Bean("C",ComponentCreatedType.Singleton)
    createC(){
        return {
            msg:"this is C"
        }
    }
}
@Component()
export class Main implements TemplateHandler{
    @AutowireProperty("A")
    a:A
    
    b:B
    @AutowireMethod("B")
    setB(b:B){
        this.b = b;
    }
    
    @AutowireProperty("C")
    c:any

    ready(){
        // console.log(this.a,this.b,this.c)
    }
}




@Component()
export class R1{
    @AutowireProperty("R2",false)
    r2:R2
}

@Component("R2")
export class R2{
    @AutowireProperty("R1")
    r1:R1
}


//从外部扫描
@ComponentScan(__dirname+"/../extra")
@Component()
export class ComponentScanTest{
    @AutowireProperty("Wow")
    wow:any

    ready(){
        console.log(this.wow)
    }
}