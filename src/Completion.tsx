import React, {forwardRef, ReactNode, useEffect, useRef, useState} from "react";
import {closePopup, popup} from "./Popup";
import {useKey} from "react-use";

export const useFocus = () => {
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
export type CompletionItem = {
    match: string;
    node: ReactNode;
    onSelect: () => void;
}
export const completion = (list: CompletionItem[], position: { x: number; y: number }) => {
    popup({
        position,
        content: <Completion list={list}/>
    })
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
        closePopup();
    }, {}, [cursor])

    return <div style={{
        minWidth: 300
    }}>
        {list.map((item, i) => {
            return <div
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                    item.onSelect()
                    closePopup()
                }}
                style={{
                    cursor: "auto",
                    backgroundColor: cursor === i ? 'rgb(194,243,203,0.5)' : undefined,
                    padding: '0 2px'
                }}
                key={i}>
                {item.node}
            </div>
        })}
    </div>
}
export const SpanInput = forwardRef<HTMLSpanElement, {
    onChange: (v: string) => void;
    value: string;
}>((props, ref) => {
        const [value, setValue] = useState('')
        useEffect(() => {
            setValue(props.value)
        }, [props.value])

        return <span
            className="mps-input"
            ref={ref}
            style={{
                minWidth: 10,
                display: "inline-block",
                outline: "none",
                borderBottom: '1px dashed rgba(0,0,0,0.3)',
            }}
            dangerouslySetInnerHTML={{__html: value}}
            contentEditable
            onInput={e => {
                const ele = e.target as HTMLSpanElement;
                const innerText = ele.innerText;
                props.onChange(innerText)
            }}/>
    }
)
export const AutoCompletion = ({getList, value}: {
    getList: () => CompletionItem[];
    value?: string;
}) => {
    const showCompletion = () => {
        if (ref.current) {
            const list = getList();
            const rect = ref.current.getBoundingClientRect();
            completion(list, {x: rect.left, y: rect.bottom})
        }
    }
    const ref = useRef<HTMLSpanElement>(null)
    const [innerValue, setInnerValue] = useState('')
    const [realValue, setRealValue] = useState(value || '')
    useEffect(() => {
        setRealValue(value || '');
    }, [value])
    useEffect(() => {
        if (ref.current) {
            const listener = (e: KeyboardEvent) => {
                const ele = e.target as HTMLSpanElement;
                const innerText = ele.innerText;
                if (innerText === '' && e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    showCompletion();
                }
            };
            ref.current.addEventListener('keydown', listener)
            return () => {
                ref.current?.removeEventListener('keydown', listener)
            }
        }
    }, [])
    return <SpanInput
        ref={ref}
        value={realValue}
        onChange={value => {
            setInnerValue(value)
            if (value.length > 0) {
                showCompletion()
            } else {
                closePopup()
            }
        }}/>
}
