// CircleLoader.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface CircleLoaderProps {
  radius?: number;
  thickness?: number;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// const CircleLoaderElement = styled.div<CircleLoaderProps>`
//   border: ${(props) => `${props.thikness || 8}px solid #3498db`}; /* Change color as needed */
//   border-radius: 50%;
//   border-top: 8px solid transparent;
//   width: ${(props) => props.radius || 50}px;
//   height: ${(props) => props.radius || 50}px;
//   animation: ${spin} 1s linear infinite;
// `;


const CircleLoaderElement = styled.div<CircleLoaderProps>`
  border: ${(props) => props.thickness || 8}px solid #3498db; /* Change color as needed */
  border-radius: 50%;
  border-top: ${(props) => props.thickness || 8}px solid transparent;
  width: ${(props) => props.radius || 50}px;
  height: ${(props) => props.radius || 50}px;
  animation: ${spin} 1s linear infinite;
`;

const CircleLoader: React.FC<CircleLoaderProps> = ({ radius, thickness }) => {
  return (
    <CircleLoaderElement radius={radius} thickness={thickness} />
  );
};

export default CircleLoader;
