import './ChartWidget.css';

// Simple SVG line chart to match the reference design
function ChartWidget() {
    const dataPoints = [1.2, 2.5, 1.8, 3.2, 2.8, 3.5, 2.2];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const maxValue = Math.max(...dataPoints);

    // Generate path for the curve
    const width = 300;
    const height = 120;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = dataPoints.map((value, index) => ({
        x: padding + (index / (dataPoints.length - 1)) * chartWidth,
        y: height - padding - (value / maxValue) * chartHeight
    }));

    // Create smooth curve using bezier
    const pathD = points.reduce((acc, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        const prev = points[index - 1];
        const cp1x = prev.x + (point.x - prev.x) / 3;
        const cp2x = prev.x + (point.x - prev.x) * 2 / 3;
        return `${acc} C ${cp1x} ${prev.y} ${cp2x} ${point.y} ${point.x} ${point.y}`;
    }, '');

    return (
        <div className="chart-widget card">
            <div className="chart-header">
                <h3 className="chart-title">Your statistics</h3>
                <div className="chart-tabs">
                    <button className="chart-tab active">Learning Hours</button>
                    <button className="chart-tab">My Courses</button>
                </div>
                <select className="chart-period">
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>

            <div className="chart-container">
                <div className="chart-y-axis">
                    <span>3.5h</span>
                    <span>2.5h</span>
                    <span>1.5h</span>
                </div>

                <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="grid-line" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} className="grid-line" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="grid-line" />

                    {/* Area fill */}
                    <path
                        d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
                        className="chart-area"
                    />

                    {/* Line */}
                    <path d={pathD} className="chart-line" />

                    {/* Data points */}
                    {points.map((point, index) => (
                        <circle key={index} cx={point.x} cy={point.y} r="4" className="chart-point" />
                    ))}
                </svg>

                <div className="chart-x-axis">
                    {days.map((day, index) => (
                        <span key={index}>{day}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChartWidget;
