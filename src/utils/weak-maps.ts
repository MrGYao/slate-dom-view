/**
 * @description 对象关联关系（部分参考 slate-react weak-maps.ts）
 * @author wangfupeng
 */

import { Node, Ancestor, Editor, Range } from 'slate'
import { IDomEditor } from '../editor/dom-editor'
import TextArea from '../text-area/TextArea'
import { Key } from './key'

// textarea 和 editor 的关联关系
export const TEXTAREA_TO_EDITOR = new WeakMap<TextArea, IDomEditor>()
export const EDITOR_TO_TEXTAREA = new WeakMap<IDomEditor, TextArea>()

/**
 * Two weak maps that allow us rebuild a path given a node. They are populated
 * at render time such that after a render occurs we can always backtrack.
 */
export const NODE_TO_INDEX: WeakMap<Node, number> = new WeakMap()
export const NODE_TO_PARENT: WeakMap<Node, Ancestor> = new WeakMap()

/**
 * Weak maps that allow us to go between Slate nodes and DOM nodes. These
 * are used to resolve DOM event-related logic into Slate actions.
 */
export const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement> = new WeakMap() // 和上面的 EDITOR_TO_TEXTAREA 是否重复？？？
export const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string> = new WeakMap()
export const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node> = new WeakMap()
export const KEY_TO_ELEMENT: WeakMap<Key, HTMLElement> = new WeakMap()
export const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement> = new WeakMap()
export const NODE_TO_KEY: WeakMap<Node, Key> = new WeakMap()


/**
 * Weak maps for storing editor-related state.
 */
export const IS_READ_ONLY: WeakMap<Editor, boolean> = new WeakMap()
export const IS_FOCUSED: WeakMap<Editor, boolean> = new WeakMap()
export const IS_DRAGGING: WeakMap<Editor, boolean> = new WeakMap()
export const IS_CLICKING: WeakMap<Editor, boolean> = new WeakMap()

/**
 * Weak map for associating the context `onChange` context with the plugin.
 */
export const EDITOR_TO_ON_CHANGE = new WeakMap<Editor, () => void>()

/**
 * Symbols.
 */
export const PLACEHOLDER_SYMBOL = (Symbol('placeholder') as unknown) as string
