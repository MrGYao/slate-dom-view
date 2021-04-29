/**
 * @description patch textarea view
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import { h, VNode } from 'snabbdom'
import { IDomEditor } from '../editor/dom-editor'
import TextArea from './TextArea'
import { genPatchFn } from '../utils/vdom'
import $, { Dom7Array } from '../utils/dom'
import { node2Vnode } from '../formats/index'
import { IS_FIRST_PATCH, TEXTAREA_TO_PATCH_FN, TEXTAREA_TO_VNODE, EDITOR_TO_ELEMENT } from '../utils/weak-maps'

function genElemId(id: number) {
    return `w-e-textarea-${id}`
}

/**
 * 生成编辑区域节点的 vnode
 * @param elemId elemId
 */
function genRootVnode(elemId: string): VNode {
    return h(`div#${elemId}`, {
        props: { contenteditable: true },
        datasets: { slateEditor: true }
    })
}

/**
 * 生成编辑区域的 elem
 * @param elemId elemId
 */
function genRootElem(elemId: string): Dom7Array {
    return $(`<div id="${elemId}" contenteditable="true" data-slate-editor></div>`)
}

/**
 * 获取 editor.children 渲染 DOM
 * @param textarea textarea
 * @param editor editor
 */
function patchView(textarea: TextArea, editor: IDomEditor) {
    const $textAreaContainer = textarea.$textAreaContainer
    const elemId = genElemId(textarea.id)

    // 生成 newVnode
    const newVnode = genRootVnode(elemId)
    const content = editor.children || []
    newVnode.children = content.map(node => node2Vnode(node))

    // 是否是第一次 patch ？
    let isFirstPatch = IS_FIRST_PATCH.get(textarea)
    if (isFirstPatch == null) isFirstPatch = true // 尚未赋值，也是第一次
    if (isFirstPatch) {
        // 第一次 patch ，先生成 elem
        const $textArea = genRootElem(elemId)
        $textAreaContainer.append($textArea)

        // 再生成 patch 函数，并执行
        const patchFn = genPatchFn()
        patchFn($textArea[0], newVnode)

        // 存储相关信息
        IS_FIRST_PATCH.set(textarea, false) // 不再是第一次 patchView
        TEXTAREA_TO_PATCH_FN.set(textarea, patchFn) // 存储 patch 函数
        TEXTAREA_TO_VNODE.set(textarea, newVnode) // 存储 vnode
        EDITOR_TO_ELEMENT.set(editor, document.getElementById(elemId) as HTMLElement) // 存储 editor -> elem 对应关系
        return
    }

    // 不是第一次 patch
    const curVnode = TEXTAREA_TO_VNODE.get(textarea)
    const patchFn = TEXTAREA_TO_PATCH_FN.get(textarea)
    const textareaElem = document.getElementById(elemId)
    if (curVnode == null || patchFn == null || textareaElem == null) return

    patchFn(curVnode, newVnode)

    // 存储相关信息
    TEXTAREA_TO_VNODE.set(textarea, newVnode) // 存储 vnode
    EDITOR_TO_ELEMENT.set(editor, textareaElem) // 存储 editor -> elem 对应关系
}

export default debounce(patchView, 100) // 设置 DOM 操作，适当防抖
