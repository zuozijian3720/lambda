import React, {createContext, ReactNode, useEffect, useState} from "react";
import {createPortal} from "react-dom";

type PopupOptions = {
    position: {
        x: number;
        y: number;
    }
    content: ReactNode
} | null
let setPopup: (node: PopupOptions) => void = () => {
}
export const popup = (node: PopupOptions) => {
    setPopup(node)
}
export const closePopup = () => {
    setPopup(null)
}
export const MainPopup = () => {
    const [options, setOptions] = useState<PopupOptions>()
    useEffect(() => {
        setPopup = setOptions;
        return () => {
            setPopup = () => {
            }
        }
    }, [])
    if (options == null) {
        return null
    }
    return createPortal(<Popup
            visible={true}
            position={options.position}>{options.content}</Popup>,
        document.body)
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
