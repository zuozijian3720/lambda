import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {lsAction} from "./LanguageService";
import {RenderLNode} from "./RenderNode";
import {MainPopup} from "./Popup";


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
    return <>
        <RenderLNode id="0"/>
        <MainPopup/>
    </>
}
