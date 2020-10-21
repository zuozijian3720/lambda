import {useDispatch, useSelector} from "react-redux";
import {lsAction} from "./LanguageService";
import React from "react";
import {useCurrentNode} from "./RenderNode";
import {SpanInput} from "./Completion";

export const Props = ({name}: { name: string }) => {
    const dispatch = useDispatch();
    const node = useCurrentNode()
    const value = useSelector(state => (state.lsStore.program[node.id].props as any)[name])
    return <SpanInput value={value} onChange={v => {
        dispatch(lsAction.updateProps({id: node.id, key: name, newValue: v}))
    }}/>
}
