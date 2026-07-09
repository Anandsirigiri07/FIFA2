import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonaSwitcher } from '../components/PersonaSwitcher';

describe('PersonaSwitcher Component', () => {
  it('highlights the selected persona', () => {
    render(<PersonaSwitcher currentPersona="fan" onChange={() => {}} />);
    const fanButton = screen.getByLabelText('Switch to Fan Persona');
    expect(fanButton).toHaveAttribute('aria-checked', 'true');

    const staffButton = screen.getByLabelText('Switch to Stadium Staff Persona');
    expect(staffButton).toHaveAttribute('aria-checked', 'false');
  });

  it('triggers onChange when clicked', () => {
    const changeSpy = vi.fn();
    render(<PersonaSwitcher currentPersona="fan" onChange={changeSpy} />);

    const staffButton = screen.getByLabelText('Switch to Stadium Staff Persona');
    fireEvent.click(staffButton);

    expect(changeSpy).toHaveBeenCalledWith('staff');
  });
});
