import React, {ComponentType, useEffect, useRef} from "react";
import {AllNodeMap} from "./LambdaType";
import {useDispatch, useSelector} from "react-redux";
import {lsAction} from "./LanguageService";

type LNodeComponent<K extends keyof AllNodeMap> = ComponentType<{ node: AllNodeMap[K] }>

const allNodeComponent: { [K in keyof AllNodeMap]: LNodeComponent<K> } = {
    Lambda: ({node}) => {
        return <span>λ.<RenderLNode id={node.argument}/> <RenderLNode id={node.body}/></span>
    },
    Apply: ({node}) => {
        return <div></div>
    },
    Identity: ({node}) => {
        const dispatch = useDispatch();
        const ref = useRef<HTMLSpanElement>(null)
        useEffect(() => {
            if (ref.current) {
                ref.current.innerHTML = node.name
            }
        }, [node.name])
        useEffect(() => {
            if (ref.current) {
                const span = ref.current;
                const input = (e: Event) => {
                    if (ref.current) {
                        dispatch(lsAction.rename({id: node.id, newName: (e.target as HTMLSpanElement).innerHTML}))
                    }
                };
                span.addEventListener('input', input)
                return () => {
                    span.removeEventListener("input", input)
                }
            }
        }, [])
        return <span ref={ref} contentEditable/>
    },
    Reference: ({node}) => {
        const idNode = useSelector(state => state.lsStore.program[node.refId])
        if (idNode?.type === "Identity") {
            return <span>{idNode.name}</span>
        }
        return null
    }
}

export const RenderLNode = ({id}: { id: string }) => {
    const program = useSelector(state => state.lsStore.program)
    const node = program[id];
    if (!node) {
        return null
    }
    const Component = allNodeComponent[node.type]
    return <Component node={node as never}/>
}
export const Main = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(lsAction.loadProgram({
                0: {
                    id: '0',
                    parentId: '0',
                    type: "Lambda",
                    argument: '1',
                    body: '2'
                },
                1: {id: '1', parentId: '0', type: "Identity", name: "x"},
                2: {id: '2', parentId: '0', type: "Reference", refId: '1'}
            })
        )
    })
    return <RenderLNode id="0"/>
}
