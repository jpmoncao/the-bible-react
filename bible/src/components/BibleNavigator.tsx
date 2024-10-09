import { useState, useEffect } from 'react';
import { Params, useNavigate } from 'react-router-dom';

import { Book } from '../interfaces/interfaces';
import api from '../services/api';

export default function BibleNavigator({ params }: { params: Readonly<Params<string>> }) {
    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [abbrev, setAbbrev] = useState<string>(params.abbrev ?? '');
    const [chapter, setChapter] = useState<number>(Number(params.chapter) || 1);
    const [maxChapters, setMaxChapters] = useState<number>(0);


    useEffect(() => {
        api.get('/books')
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (abbrev && books.length > 0) {
            const selectedBook = books.find(book => book.abbrev.pt === abbrev);
            if (selectedBook) {
                setMaxChapters(selectedBook.chapters);
            }
        }
    }, [abbrev, books]);


    const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAbbrev = event.target.value;
        setAbbrev(selectedAbbrev);

        if (selectedAbbrev) {
            navigate(`/${selectedAbbrev}/1`);
            setChapter(1); // Resetar capítulo para 1 ao selecionar novo livro
        }
    };

    const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedChapter = Number(event.target.value);
        setChapter(selectedChapter);
        navigate(`/${abbrev}/${selectedChapter}`);
    };

    const handleChapterPrevious = () => {
        if (chapter > 1) {
            const newChapter = chapter - 1;
            setChapter(newChapter);
            navigate(`/${abbrev}/${newChapter}`);
        }
    };

    const handleChapterNext = () => {
        if (chapter < maxChapters) {
            const newChapter = chapter + 1;
            setChapter(newChapter);
            navigate(`/${abbrev}/${newChapter}`);
        }
    };

    return (
        <div className='fixed w-full flex justify-around items-center bg-[#1a1a1a] h-20 py-2 px-16 top-[calc(100vh-5rem)]'>
            <button className='h-12 rounded-xl border border-[#dddddd25] shadow-bottom py-2 px-6 text-md font-semibold bg-[#1a1a1a] transition-colors' onClick={handleChapterPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
            </button>
            <div className='flex gap-8'>
                <select className='h-12 rounded-xl border border-[#dddddd25] shadow-bottom py-2 px-6 text-md font-semibold bg-[#1a1a1a] transition-colors' name="abbrev" id="abbrev" value={abbrev} onChange={handleBookChange} disabled={books && books.length === 0}>
                    <option value="" disabled></option>
                    {
                        books && books.map((book, index) => (
                            <option key={index} value={book.abbrev.pt}>{book.name}</option>
                        ))
                    }
                </select>

                <select className='h-12 rounded-xl border border-[#dddddd25] shadow-bottom py-2 px-6 text-md font-semibold bg-[#1a1a1a] transition-colors' value={chapter} onChange={handleChapterChange} disabled={maxChapters === 0}>
                    {
                        maxChapters > 0 && (
                            Array.from({ length: maxChapters }, (_, index) => (
                                <option value={index + 1} key={index + 1}>{index + 1}</option>
                            ))
                        )
                    }
                </select>

            </div>

            <button className='h-12 rounded-xl border border-[#dddddd25] shadow-bottom py-2 px-6 text-md font-semibold bg-[#1a1a1a] transition-colors' onClick={handleChapterNext}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
            </button>
        </div>
    )
}