import {ComponentType} from "react";
import {MPSInstance} from "./Instance";

const ChildCount = {
    option: '0..1',
    must: '1',
    optionList: '0..n',
    noEmptyList: '1..n',
} as const;
type ChildCount = typeof ChildCount

export type ChildDefine = {
    hint: string;
    count: ChildCount[keyof ChildCount];
}

export type MPSComponent = {
    type: string;
    name: string;
    children: Record<string, ChildDefine>
    props: any
}
export type MPSRenderer = {
    type: string;
    render: ComponentType<{
        node: MPSInstance;
    }>
}

export type MPSCompletion = {
    matcher: (options: {
        node: MPSInstance;
        componentMap: Record<string, MPSComponent>;
        instanceMap: Record<string, MPSInstance>;
    }) => boolean

}

const Lambda: MPSComponent = {
    type: 'Lambda',
    name: '匿名函数',
    children: {
        argument: {
            hint: '参数',
            count: ChildCount.must
        },
        body: {
            hint: '函数体',
            count: ChildCount.must
        }
    },
    props: {}
}
const Apply: MPSComponent = {
    type: 'Apply',
    name: '函数应用',
    children: {
        lambda: {
            hint: '函数',
            count: ChildCount.must
        },
        argument: {
            hint: '参数',
            count: ChildCount.must
        }
    },
    props: {}
}

const Identity: MPSComponent = {
    type: 'Identity',
    name: '符号',
    children: {},
    props: {}
}
const Reference: MPSComponent = {
    type: 'Reference',
    name: '引用',
    children: {},
    props: {}
}
