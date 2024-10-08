import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

interface Verse {
    number: number;
    text: string;
}

interface Book {
    name: string;
    author: string;
}

interface PropsInterface {
    abbrev: string;
    chapter: number;
}

const VERSION = 'nvi';
const BASE_URL = 'https://www.abibliadigital.com.br/api/verses';


export default function Bible(props: PropsInterface) {
    const { abbrev, chapter } = props;
    const [bookInfo, setBookInfo] = useState<{ book: Book; verses: Verse[] } | null>(null);

    useEffect(() => {
        setBookInfo(null)
        console.log('Buscando...');

        axios.get(`${BASE_URL}/${VERSION}/${abbrev}/${chapter}`, {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUdWUgT2N0IDA4IDIwMjQgMTI6NDg6MTkgR01UKzAwMDAucGVkcm9oam9hbzQ0QGdtYWlsLmNvbSIsImlhdCI6MTcyODM5MTY5OX0.jdgIvxxfHBhnly-RXKM0pVSPqZZBCSt9BKITs07sy-w'
            }
        })
            .then(response => {
                console.log(response.data)
                let { book, verses } = response.data;
                setBookInfo({ book, verses });
            })
            .catch(error => {
                console.log(error);
            });
    }, [abbrev, chapter]);

    return (
        <div>
            <button>🖊️</button>
            <main className='bible-container'>
                {bookInfo ? (
                    <>
                        <h1 id="book-name">{bookInfo.book.name}</h1>
                        <h2 id="book-author">{bookInfo.book.author}</h2>
                        <div id="container">
                            {bookInfo.verses.map((verse) => (
                                <span key={`${props.abbrev}${props.chapter}:${verse.number}`}>
                                    <sup>  {verse.number}</sup><span>{verse.text}</span>
                                </span>
                            ))}
                        </div>
                    </>
                ) : <p>Buscando...</p>}
            </main>
        </div>
    )
}