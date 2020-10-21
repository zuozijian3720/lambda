export type LNode<K = string, T = {}> = {
    parentId: string;
    id: string;
    type: K
    children: {}
    refs:{}
    props:{}
} & T

export type LNodeMap = {
    Lambda: {
        children: {
            argument: string
            body: string
        }
    }
    Apply: {
        children: {
            lambda: string
            argument: string
        }
    }
    Identity: {
        props:{
            name: string
        }
    }
    Reference: {
        refs: {
            ref: string
        }
    }
}

export type AllNode = { [K in keyof LNodeMap]: LNode<K, LNodeMap[K]> }[keyof LNodeMap]
export type Program = Record<string, AllNode>
export type AllNodeMap = { [K in keyof LNodeMap]: LNode<K, LNodeMap[K]> }
