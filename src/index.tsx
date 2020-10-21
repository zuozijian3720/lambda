import React, {ComponentType, ReactNode, useEffect, useRef, useState} from "react";
import {AllNode, AllNodeMap} from "./LambdaType";
import {useDispatch, useSelector} from "react-redux";
import {lsAction} from "./LanguageService";
import {createPortal} from "react-dom";
import {useKey} from "react-use";

type LNodeComponent<K extends keyof AllNodeMap> = ComponentType<{ node: AllNodeMap[K] }>
const PropsEditor = ({id, key}: { id: string; key: string }) => {
    const dispatch = useDispatch();
    const value = useSelector(state => (state.lsStore.program[id].props as any)[key])
    return <span style={{
        minWidth: 5,
        border: "none",
        outline: "none",
    }} dangerouslySetInnerHTML={{__html: value}} contentEditable onInput={e => {
        dispatch(lsAction.updateProps({id, key, newValue: (e.target as HTMLSpanElement).innerText}))
    }}/>
}
const allNodeComponent: { [K in keyof AllNodeMap]: LNodeComponent<K> } = {
    Lambda: ({node}) => {
        return <span>λ.<RenderChild node={node} name="argument"/> <RenderChild node={node} name="body"/></span>
    },
    Apply: ({node}) => {
        return <div></div>
    },
    Identity: ({node}) => {
        return <PropsEditor id={node.id} key="name"/>
    },
    Reference: ({node}) => {
        const idNode = useSelector(state => state.lsStore.program[node.refs.ref])
        if (idNode?.type === "Identity") {
            return <span>{idNode.props.name}</span>
        }
        return null
    }
}

export type CompletionItem = {
    match: string;
    node: ReactNode;
    onSelect: () => void;
}

export const Completion = (
    {
        list,
    }: {
        list: CompletionItem[];
    }) => {
    const [cursor, setCursor] = useState(0)
    useKey('ArrowDown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCursor(Math.min(cursor + 1, list.length - 1))
    }, {}, [cursor])
    useKey('ArrowUp', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCursor(Math.max(0, cursor - 1))
    }, {}, [cursor])
    useKey('Enter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        list[cursor].onSelect()
    }, {}, [cursor])
    return <div style={{
        minWidth: 300
    }}>
        {list.map((item, i) => {
            return <div
                onMouseEnter={() => setCursor(i)}
                onClick={item.onSelect}
                style={{
                    cursor: "auto",
                    backgroundColor: cursor === i ? 'rgb(194,243,203,0.5)' : undefined,
                    padding: '0 2px'
                }} key={i}>{item.node}</div>
        })}
    </div>
}
export const Popup = (
    {
        children,
        position,
        visible
    }: {
        children: ReactNode,
        position: {
            x: number;
            y: number
        }
        visible: boolean;
    }) => {
    if (!visible) {
        return null
    }
    return createPortal(<div style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }}>
        <div style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            backgroundColor: 'rgb(64,64,64,0.7)',
            boxShadow: '1px 1px 10px 5px rgba(0,0,0,0.15)',
            borderRadius: 1,
            color: "rgb(255,255,255,0.8)"
        }}>{children}</div>
    </div>, document.body)
}
const useFocus = () => {
    const [value, setValue] = useState(false)
    const ref = useRef<HTMLElement>(null)
    useEffect(() => {
        const ele = ref.current;
        if (ele) {
            const focus = () => setValue(true)
            const blur = () => setValue(false);
            ele.addEventListener('focus', focus)
            ele.addEventListener('blur', blur)
            return () => {
                ele.removeEventListener('focus', focus)
                ele.removeEventListener('blur', blur)
            }
        }
    }, [])
    return [value, ref] as const
}

export const NodeCompletion = ({name, node}: { node: AllNode, name: string }) => {
    const [position, setPosition] = useState({x: 0, y: 0})
    useEffect(() => {
        const current = ref.current;
        if (current) {
            const rect = current.getBoundingClientRect();
            setPosition({
                x: rect.left,
                y: rect.bottom,
            })
        }
    }, [])
    const [focus, ref] = useFocus()
    const dispatch = useDispatch();
    return <span>
        <span style={{
            display: "inline-block",
            fontSize: 12,
            padding: '0 2px',
            backgroundColor: "#c0eedf",
            borderRadius: 4,
        }}>{name}:<span
            ref={ref}
            style={{
                minWidth: 10,
                display: "inline-block",
                outline: "none",
            }} placeholder="hole" contentEditable onInput={e => {

        }}/></span>
        <Popup visible={focus} position={position}>
            <Completion
                list={[
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
        </Popup>
    </span>
}

export const RenderChild = <N extends AllNode>(
    {
        node,
        name
    }: {
        node: N,
        name: Extract<keyof N['children'], string>
    }) => {
    const program = useSelector(state => state.lsStore.program)
    let childId = (node.children as any)[name];
    const child = program[childId];
    if (!child) {
        return <NodeCompletion node={node} name={name}/>
    }
    return <RenderLNode id={childId}/>
}

export const RenderLNode = ({id}: { id: string }) => {
    const program = useSelector(state => state.lsStore.program)
    console.log(program)
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
        dispatch(lsAction.loadProgram(
            {
                0: {
                    id: '0',
                    parentId: '0',
                    type: "Lambda",
                    children: {
                        argument: '',
                        body: ''
                    },
                    refs: {},
                    props: {}
                },
            }
            )
        )
    })
    return <RenderLNode id="0"/>
}
