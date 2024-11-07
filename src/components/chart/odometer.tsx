import React from 'react';
import { useSpring, animated } from 'react-spring';

interface OdometerProps {
  value: number;
}

const Odometer: React.FC<OdometerProps> = ({ value }) => {
    const maxValue = 100; // Adjust this value to the max you want
    const angle = ((value % maxValue) / maxValue) * 360; // Normalize the value to an angle
  
    const props = useSpring({ to: { angle }, from: { angle: 0 }, config: { tension: 170, friction: 26 } });
  
    return (
        <div className="odometer-container">
          <div className="odometer">
            <svg width="250" height="250">
              <circle cx="125" cy="125" r="110" stroke="lightgray" strokeWidth="10" fill="none" />
              <animated.line
                x1="125"
                y1="125"
                x2="125"
                y2="40"
                stroke="red"
                strokeWidth="3"
                style={{
                  transformOrigin: '125px 125px',
                  transform: props.angle.to(a => `rotate(${a}deg)`),
                }}
              />
              {/* Tick marks */}
              {[...Array(10)].map((_, index) => {
                const tickAngle = (index / 10) * 360;
                const x1 = 125 + 90 * Math.cos((tickAngle * Math.PI) / 180);
                const y1 = 125 + 90 * Math.sin((tickAngle * Math.PI) / 180);
                const x2 = 125 + 100 * Math.cos((tickAngle * Math.PI) / 180);
                const y2 = 125 + 100 * Math.sin((tickAngle * Math.PI) / 180);
                return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="lightgray" strokeWidth="2" />;
              })}
            </svg>
            <div className="value">{value}</div>
          </div>
        </div>
    );
};

export default Odometer;