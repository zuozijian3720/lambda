import {effect, ref, Ref, stop, toRaw, UnwrapRef} from "@vue/reactivity";
import {AllNode, LNodeMap, Program} from "./LambdaType";
import {useEffect, useState} from "react";
import {createEntityAdapter, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createSelector} from "reselect/src";
import {useSelector} from "react-redux";

// type MemoLNodeMap = {
//     Lambda: {
//         scope: Record<string, AllNode>
//     }
// } & { [K in keyof LNodeMap]: {ast:} }
// type MemoAllNode = { [K in keyof MemoLNodeMap]: LNode<K, MemoLNodeMap[K]> }[keyof MemoLNodeMap]
// const id = <T>(a: T) => a
// const codeToProgramMap: { [K in keyof LNodeMap]: (code: LNodeMap[K]) => MemoLNodeMap[K] } = {
//     Lambda: code => ({scope: {}}),
//     Apply: id,
//     Identity: id,
//     Reference: id
// }

interface PSIElement {
    getChildren(): PSIElement[]

    getParent(): PSIElement

    getAST(): AllNode
}

type Options = { node: AllNode, program: Record<string, AllNode> };
// const createPsi = (options: Options) => psiImpl[options.node.type](options)
// const getParent = (options: Options) => createPsi({...options, node: options.program[options.node.parentId]})
// const psiImpl: { [K in keyof LNodeMap]: (options: Options) => PSIElement } = ({
//         Lambda: (options) => ({
//                 getAST(): AllNode {
//                     return options.node
//                 },
//                 getParent(): PSIElement {
//                     return getParent(options)
//                 },
//                 getChildren(): PSIElement[] {
//                     return options
//                 }
//             }
//         )
//     }
// )

class Base<T> {
    private _valueRef: Ref<UnwrapRef<T>>

    set value(v: UnwrapRef<T>) {
        this._valueRef.value = v
    }

    get value() {
        return this._valueRef.value
    }

    constructor(init: T) {
        this._valueRef = ref(init)
    }

}

type LSData = {
    program: Program
};

export class LanguageService extends Base<LSData> {
    loadProgram = (program: Program) => {
        this.value.program = program
    }

    getSymbol = (id: string): LNodeMap["Identity"] | undefined => {
        const identity = this.value.program[id];
        if (identity.type === 'Identity') {
            return identity
        }
    }

    useValue = <T>(map: (v: LSData) => T) => {
        const [data, setData] = useState<T>(() => toRaw(map(this.value)))
        useEffect(() => {
            const e = effect(() => {
                const result = map(this.value);
                return setData(result);
            })
            return () => stop(e)
        })
        return data;
    }
    use = <T>(map: (v: this) => T) => {
        const [data, setData] = useState<T>(() => toRaw(map(this)))
        useEffect(() => {
            const e = effect(() => {
                const result = map(this);
                return setData(result);
            })
            return () => stop(e)
        })
        return data;
    }
}

export const {
    reducer: lsReducer,
    actions: lsAction
} = createSlice({
    name: 'language service',
    initialState: {
        program: {}
    } as LSData,
    reducers: {
        loadProgram: (state, action: PayloadAction<Program>) => {
            state.program = action.payload
        },
        rename: (state, {payload}: PayloadAction<{
            id: string;
            newName: string;
        }>) => {
            const node = state.program[payload.id];
            if (node.type === "Identity") {
                node.name = payload.newName
            }
        }
    }
})
