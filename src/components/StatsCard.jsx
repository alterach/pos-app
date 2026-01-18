import './StatsCard.css';

function StatsCard({ value, label, icon: Icon, color = 'accent' }) {
    return (
        <div className={`stats-card stats-card--${color}`}>
            <div className="stats-card-content">
                <span className="stats-value">{value}</span>
                <span className="stats-label">{label}</span>
            </div>
            {Icon && (
                <div className="stats-icon">
                    <Icon size={24} />
                </div>
            )}
        </div>
    );
}

export default StatsCard;
