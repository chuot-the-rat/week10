import { useEffect, useState } from "react";

function BookCard({ book, isSelected, onSelect, isOnLoan }) {
    const [showDetails, setShowDetails] = useState(false);
    const [similar, setSimilar] = useState([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);

    const handleCardClick = (e) => {
        if (e.target.closest("a") || e.target.closest("button")) return;
        onSelect();
    };

    useEffect(() => {
        if (!showDetails) return;
        const q = (book.author || book.publisher || book.title || "")
            .split(",")[0]
            .trim();
        if (!q) return;
        const fetchSimilar = async () => {
            setLoadingSimilar(true);
            try {
                const res = await fetch(
                    `https://api.itbook.store/1.0/search/${encodeURIComponent(
                        q
                    )}`
                );
                const data = await res.json();
                setSimilar(
                    Array.isArray(data.books) ? data.books.slice(0, 6) : []
                );
            } catch (err) {
                setSimilar([]);
            } finally {
                setLoadingSimilar(false);
            }
        };
        void fetchSimilar();
    }, [showDetails, book.author, book.publisher, book.title]);

    if (showDetails) {
        return (
            <div className={`card ${isSelected ? "card-selected" : ""} book-details`}>
                {isOnLoan && <div className="loan-badge">On Loan</div>}
                <div className="details-row">
                    <div className="image details-image">
                        <img
                            src={book.image}
                            alt={book.title}
                        />
                    </div>
                    <div className="details-meta">
                        <div className="title">
                            <h2>{book.title}</h2>
                        </div>
                        {book.subtitle && (
                            <div className="subtitle">
                                <em>{book.subtitle}</em>
                            </div>
                        )}
                        <div className="details-info">
                            {book.author && <div>Author: {book.author}</div>}
                            {book.publisher && (
                                <div>Publisher: {book.publisher}</div>
                            )}
                            {book.publicationYear && (
                                <div>Year: {book.publicationYear}</div>
                            )}
                            {book.pages && <div>Pages: {book.pages}</div>}
                            {book.price && <div>Price: {book.price}</div>}
                        </div>
                        <div className="details-actions">
                            <button
                                type="button"
                                className="btn-back"
                                onClick={() => setShowDetails(false)}
                            >
                                ← Back
                            </button>
                            <a
                                href={book.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <button type="button" className="btn-store">Open Store Page</button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="similar-section">
                    <h3>Similar books</h3>
                    {loadingSimilar ? (
                        <p>Loading…</p>
                    ) : similar.length === 0 ? (
                        <p>No similar books found.</p>
                    ) : (
                        <div className="similar-list">
                            {similar.map((s) => (
                                <a
                                    key={s.isbn13}
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="similar-link"
                                >
                                    <div className="small-card">
                                        <div className="image small-image">
                                            <img
                                                src={s.image}
                                                alt={s.title}
                                            />
                                        </div>
                                        <div className="small-title">
                                            {s.title}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`card ${isSelected ? "card-selected" : ""}`} onClick={handleCardClick}>
            {isOnLoan && <div className="loan-badge">On Loan</div>}
            <a
                href={book.url}
                target="_blank"
                rel="noreferrer"
            >
                <div className="image">
                    <img
                        src={book.image}
                        alt={book.title}
                    />
                </div>
                <div className="title">
                    <h2>{book.title}</h2>
                </div>
                <div className="price">
                    <p>Price: {book.price}</p>
                </div>
            </a>

            <div className="card-actions">
                <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default BookCard;
