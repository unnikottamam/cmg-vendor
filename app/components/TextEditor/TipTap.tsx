"use client";
import React from 'react';
import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { LuHeading1, LuHeading2, LuHeading3, LuList } from "react-icons/lu";

const TipTap = ({ content, onChange }: { content: string, onChange: (richText: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-2"
                    }
                },
                heading: false
            }),
            Heading.extend({
                levels: [1, 2],
                renderHTML({ node, HTMLAttributes }) {
                    const level = this.options.levels.includes(node.attrs.level)
                        ? node.attrs.level
                        : this.options.levels[0];
                    const classes: { [index: number]: string } = {
                        1: 'text-3xl',
                        2: 'text-2xl',
                        3: 'text-xl',
                    };
                    return [
                        `h${level}`,
                        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                            class: `font-bold ${classes[level]}`,
                        }),
                        0,
                    ];
                },
            }).configure({
                levels: [1, 2, 3]
            }),
        ],
        editorProps: {
            attributes: {
                class: "block w-full border-0 py-2.5 px-5 text-gray-900 min-h-40"
            }
        },
        content: content,
        autofocus: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    });

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col border rounded-md border-gray-300">
            <div className="flex items-center flex-wrap gap-1 border-b p-1 px-2 text-lg">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`border rounded-sm p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : ''}`}
                >
                    <LuHeading1 />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`border rounded-sm p-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : ''}`}
                >
                    <LuHeading2 />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`border rounded-sm p-1 ${editor.isActive('heading', { level: 3 }) ? 'bg-black text-white' : ''}`}
                >
                    <LuHeading3 />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`border rounded-sm p-1 me-2 ${editor.isActive('bulletList') ? 'bg-black text-white' : ''}`}
                >
                    <LuList />
                </button>
                <p className="text-xs m-0">Select Apropriate Text Styles</p>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

export default TipTap