import {AllNode} from "./LambdaType";
import {useCurrentNode} from "./RenderNode";
import {useDispatch, useSelector} from "react-redux";
import {AutoCompletion} from "./Completion";
import {lsAction} from "./LanguageService";
import React from "react";

const getAllRef = (program: Record<string, AllNode>, node: AllNode): AllNode[] => {
    if (!node || node.id === '0') {
        return [];
    }
    const ids = [];
    const parent = program[node.parentId];
    if (parent.type === 'Lambda') {
        const idNode = program[parent.children.argument];
        if (idNode && idNode.type === "Identity") {
            ids.push(idNode)
        }
    }
    return [...ids, ...getAllRef(program, parent)]
}
export const Ref = ({name}: { name: string, map: (node: AllNode) => string | null }) => {
    const node = useCurrentNode()
    const dispatch = useDispatch();
    const program = useSelector(state => state.lsStore.program);
    const refNode = program[(node.refs as any)[name]];
    return <AutoCompletion
        value={refNode && refNode.type === 'Identity' ? refNode?.props.name : undefined}
        getList={() => getAllRef(program, node).map(v => v.type === "Identity" ? ({
            match: v.props.name,
            node: <div>{v.props.name}</div>,
            onSelect: () => {
                dispatch(lsAction.updateRefs({
                        id: node.id,
                        key: name,
                        newValue: v.id,
                    })
                )
            }
        }) : null).filter(Boolean) as any}
    />
}
