import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Settings from './Settings';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { email: 'test@test.com' }
  }),
}));

describe('Settings Component', () => {
    it('should render the theme selection buttons', () => {
        render(
            <MemoryRouter>
                    <Settings />
            </MemoryRouter>
        );

        const nameInput = screen.getByPlaceholderText(/enter your name/i);
        const emailInput = screen.getByPlaceholderText(/enter your email/i);
        const saveButton = screen.getByText(/save changes/i);

        expect(nameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();

        const appearanceTab = screen.getByText(/appearance/i);
        fireEvent.click(appearanceTab);

        const lightButton = screen.getByText(/light/i);
        const darkButton = screen.getByText(/dark/i);
        const systemButton = screen.getByText(/system/i);

        expect(lightButton).toBeInTheDocument();
        expect(darkButton).toBeInTheDocument();
        expect(systemButton).toBeInTheDocument();
    })
})