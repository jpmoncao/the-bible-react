import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';
import Bible from './components/Bible';

interface Book {
  abbrev: {
    "pt": string,
    "en": string
  },
  author: string,
  chapters: number,
  group: string,
  name: string,
  testament: string
}

const BASE_URL = 'https://www.abibliadigital.com.br/api/books';

function App() {
  const navigate = useNavigate();
  const params = useParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [abbrev, setAbbrev] = useState<string>(params.abbrev ?? '');
  const [chapter, setChapter] = useState<number>(Number(params.chapter) || 1);
  const [maxChapters, setMaxChapters] = useState<number>(0);

  useEffect(() => {
    axios.get(`${BASE_URL}/`, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUdWUgT2N0IDA4IDIwMjQgMTI6NDg6MTkgR01UKzAwMDAucGVkcm9oam9hbzQ0QGdtYWlsLmNvbSIsImlhdCI6MTcyODM5MTY5OX0.jdgIvxxfHBhnly-RXKM0pVSPqZZBCSt9BKITs07sy-w'
      }
    })
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
    <>
      <Bible
        abbrev={abbrev}
        chapter={chapter}
      />
      <div className='router-bible'>
        <button onClick={handleChapterPrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
        </button>

        <div>

          <select name="abbrev" id="abbrev" value={abbrev} onChange={handleBookChange} disabled={books && books.length === 0}>
            <option value="" disabled></option>
            {
              books && books.map((book, index) => (
                <option key={index} value={book.abbrev.pt}>{book.name}</option>
              ))
            }
          </select>

          <select className='chapters' value={chapter} onChange={handleChapterChange} disabled={maxChapters === 0}>
            {
              maxChapters > 0 && (
                Array.from({ length: maxChapters }, (_, index) => (
                  <option value={index + 1} key={index + 1}>{index + 1}</option>
                ))
              )
            }
          </select>

        </div>

        <button onClick={handleChapterNext}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
        </button>
      </div>
    </>
  );
}

export default App;
