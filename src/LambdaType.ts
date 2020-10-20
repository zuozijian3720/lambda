export type LNode<K = string, T = {}> = {
    parentId: string;
    id: string;
    type: K
} & T

export type LNodeMap = {
    Lambda: {
        argument: string
        body: string
    }
    Apply: {
        lambda: string
        argument: string
    }
    Identity: {
        name: string
    }
    Reference: {
        refId: string
    }
}

export type AllNode = { [K in keyof LNodeMap]: LNode<K, LNodeMap[K]> }[keyof LNodeMap]
export type Program = Record<string, AllNode>
export type AllNodeMap = { [K in keyof LNodeMap]: LNode<K, LNodeMap[K]> }
