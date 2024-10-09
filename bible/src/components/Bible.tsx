import { useState, useEffect } from 'react';

import { EditorContent, useEditor, BubbleMenu, Editor } from '@tiptap/react';
import { EditorView } from '@tiptap/pm/view';
import { EditorState } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';

import { BookSimple, Verse } from '../interfaces/interfaces';
import api from '../services/api';
import Paragraph from '@tiptap/extension-paragraph';

interface PropsInterface {
    abbrev: string;
    chapter: number;
    version: string;
}

interface handleShowBubbleMenuProps {
    editor: Editor;
    view: EditorView;
    state: EditorState;
    oldState?: EditorState | undefined;
    from: number;
    to: number;
}

export default function Bible(props: PropsInterface) {
    const { abbrev, chapter, version } = props;
    const [bookInfo, setBookInfo] = useState<{ book: BookSimple; verses: Verse[] } | null>(null);

    const editor = useEditor({
        extensions: [
            Superscript,
            StarterKit,
            Highlight,
            Paragraph
        ],
        content: '',
        editable: false
    });

    const handleShowBubbleMenu = (props: handleShowBubbleMenuProps) => {
        const { from, to, empty } = props.editor.state.selection;
        return (from != to && !empty);
    }

    const handleHighlight = () => {
        if (!editor)
            return

        editor.chain().focus().toggleHighlight().run();
        editor.chain().focus().setTextSelection(0).run();
    }

    useEffect(() => {
        if (abbrev.trim() !== '' && chapter > 0) {
            api.get(`/verses/${version}/${abbrev}/${chapter}`)
                .then(response => {
                    const { book, verses } = response.data;
                    setBookInfo({ book, verses });

                    if (editor) {
                        const content = verses.map((verse: Verse) => (
                            `<span key="${props.abbrev}${props.chapter}:${verse.number}">
                                <sup>${verse.number}</sup> ${verse.text}
                            </span>`
                        )).join('');
                        editor.commands.setContent(content);
                    }
                })
                .catch(console.error);
        }
    }, [abbrev, chapter, editor]);

    return (
        <div>
            <main className='px-10 text-justify max-w-[680px]'>
                {bookInfo ? (
                    <>
                        <div className='flex items-end gap-4 my-12'>
                            <h1 id="book-name" className='m-0'>{bookInfo.book.name}</h1>
                            <h3 id="book-author" className='m-0'>(de {bookInfo.book.author})</h3>
                        </div>
                        {editor && (
                            <>
                                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} shouldShow={(props) => handleShowBubbleMenu(props)}>
                                    <div className="bubble-menu">
                                        <button onClick={handleHighlight}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1a1a1a"><path d="M551-800H280v-80h351l-80 80ZM391-640H160v-80h311l-80 80ZM231-480H40v-80h271l-80 80Zm353 80L480-504 280-304l104 104 200-200Zm-47-161 104 104 199-199-104-104-199 199Zm-84-28 216 216-229 229q-24 24-56 24t-56-24l-2-2-26 26H100l126-126-2-2q-24-24-24-56t24-56l229-229Zm0 0 227-227q24-24 56-24t56 24l104 104q24 24 24 56t-24 56L669-373 453-589Z" /></svg>
                                        </button>
                                    </div>
                                </BubbleMenu>
                                <EditorContent
                                    editor={editor}
                                />
                            </>
                        )}
                    </>
                ) : abbrev && chapter && (<p>Buscando...</p>)}
            </main>
        </div>
    );
}
