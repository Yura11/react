import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddProduct from './AddProduct';

describe('AddProduct component', () => {
    it('should render AddProduct component', () => {
        const { getByText, getByPlaceholderText } = render(<AddProduct />);
        expect(getByText('Title')).toBeInTheDocument();
        expect(getByPlaceholderText('Title')).toBeInTheDocument();
        expect(getByText('Price')).toBeInTheDocument();
        expect(getByPlaceholderText('Price')).toBeInTheDocument();
        expect(getByText('Save')).toBeInTheDocument();
    });

    it('should update title and price when input values change', () => {
        const { getByPlaceholderText } = render(<AddProduct />);
        const titleInput = getByPlaceholderText('Title');
        const priceInput = getByPlaceholderText('Price');

        fireEvent.change(titleInput, { target: { value: 'New Title' } });
        fireEvent.change(priceInput, { target: { value: '10.99' } });

        expect(titleInput.value).toBe('New Title');
        expect(priceInput.value).toBe('10.99');
    });

    it('should submit form with correct data when Save button is clicked', async () => {
        const mockFetch = jest.fn(() => Promise.resolve({ ok: true }));
        global.fetch = mockFetch;

        const { getByPlaceholderText, getByText } = render(<AddProduct />);
        const titleInput = getByPlaceholderText('Title');
        const priceInput = getByPlaceholderText('Price');
        const saveButton = getByText('Save');

        fireEvent.change(titleInput, { target: { value: 'New Title' } });
        fireEvent.change(priceInput, { target: { value: '10.99' } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/products', {
                method: 'POST',
                body: JSON.stringify({ id: expect.any(String), title: 'New Title', price: '10.99' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });
    });

    it('should not submit form if title or price is empty', () => {
        const mockFetch = jest.fn();
        global.fetch = mockFetch;

        const { getByText } = render(<AddProduct />);
        const saveButton = getByText('Save');
        
        fireEvent.click(saveButton);

        expect(mockFetch).not.toHaveBeenCalled();
    });
});
