import './PromoCard.css';

function PromoCard() {
    return (
        <div className="promo-card">
            <div className="promo-illustration">
                <span className="promo-emoji">📚</span>
            </div>
            <div className="promo-content">
                <h3 className="promo-title">Learn even more!</h3>
                <p className="promo-text">
                    Unlock premium features<br />
                    only for <strong>$9.99</strong> per month.
                </p>
                <button className="promo-btn">Go Premium</button>
            </div>
        </div>
    );
}

export default PromoCard;
