import {useDispatch, useSelector} from "react-redux";
import React, {createContext, useContext} from "react";
import {allNodeComponent} from "./AllNodeComponent";
import {AllNode, AllNodeMap} from "./LambdaType";
import {lsAction} from "./LanguageService";
import {AutoCompletion} from "./Completion";

export const RenderLNode = ({id}: { id: string }) => {
    const program = useSelector(state => state.lsStore.program)
    const node = program[id];
    if (!node) {
        console.error(`${id} 号组件不存在`)
        return null
    }
    const Component = allNodeComponent[node.type]
    return <Context.Provider value={node}>
        <span id={`mps-component-${node.id}`} style={{display: "inline-block"}}>
            <Component key={node.id}/>
        </span>
    </Context.Provider>
}
const Context = createContext<AllNode | null>(null)
export const useCurrentNode = <K extends keyof AllNodeMap>() => {
    return useContext(Context) as AllNodeMap[K]
}
export const NodeCompletion = ({name}: { name: string }) => {
    const node = useCurrentNode()
    const dispatch = useDispatch();
    return <AutoCompletion getList={() => [
        {
            match: 'Identity',
            node: <div>Identity</div>,
            onSelect: () => {
                dispatch(lsAction.newInstance({
                        type: 'Identity',
                        key: name,
                        parentId: node.id,
                    })
                )
            }
        },{
            match: 'Lambda',
            node: <div>Lambda</div>,
            onSelect: () => {
                dispatch(lsAction.newInstance({
                        type: 'Lambda',
                        key: name,
                        parentId: node.id,
                    })
                )
            }
        },
        {
            match: 'Reference',
            node: <div>Reference</div>,
            onSelect: () => {
                dispatch(lsAction.newInstance({
                    type: 'Reference',
                    key: name,
                    parentId: node.id,
                }))
            }
        }
    ]}/>
}
export const Child = ({name}: { name: string }) => {
    const program = useSelector(state => state.lsStore.program)
    const node = useCurrentNode();
    const childId = (node.children as any)[name];
    const child = program[childId];
    if (!child) {
        return <NodeCompletion name={name}/>
    }
    return <RenderLNode id={childId}/>
}
