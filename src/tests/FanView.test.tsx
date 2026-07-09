import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FanView } from '../views/FanView';

describe('FanView View Component', () => {
  it('renders Host Stadium details and queues', () => {
    render(<FanView venueId="metlife" language="en" />);
    
    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('East Food Court')).toBeInTheDocument();
  });

  it('updates carbon calculation results when input changes', () => {
    render(<FanView venueId="metlife" language="en" />);
    
    const distInput = screen.getByLabelText('Input travel distance in kilometres');
    fireEvent.change(distInput, { target: { value: '20' } });
    
    expect(screen.getByText('3.38 kg CO₂')).toBeInTheDocument();
  });
});
