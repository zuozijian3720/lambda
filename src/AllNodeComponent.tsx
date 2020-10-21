import {AllNodeMap} from "./LambdaType";
import React, {ComponentType} from "react";
import {Props} from "./PropsEditor";
import {Child} from "./RenderNode";
import {Ref} from "./RefEditor";

export const allNodeComponent: { [K in keyof AllNodeMap]: ComponentType } = {
    Lambda: () => {
        return <span>λ.<Child name="argument"/> <Child name="body"/></span>
    },
    Apply: () => {
        return <div></div>
    },
    Identity: () => {
        return <Props name="name"/>
    },
    Reference: () => {
        return <Ref name="ref" map={node => node.type === "Identity" ? node.props.name : null}/>
    }
}
