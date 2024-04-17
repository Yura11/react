import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProductList from './ProductList';

describe('ProductList component', () => {
    it('should render ProductList component', () => {
        const { getByText } = render(<ProductList />);
        expect(getByText('Add New')).toBeInTheDocument();
        expect(getByText('Id')).toBeInTheDocument();
        expect(getByText('Title')).toBeInTheDocument();
        expect(getByText('Price')).toBeInTheDocument();
        expect(getByText('Actions')).toBeInTheDocument();
    });

    it('should fetch and display products', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([{ id: '1', title: 'Product 1', price: '10.99' }])
        });

        const { getByText } = render(<ProductList />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/products');
            expect(getByText('Product 1')).toBeInTheDocument();
            expect(getByText('10.99')).toBeInTheDocument();
        });
    });

    it('should delete a product when Delete button is clicked', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([{ id: '1', title: 'Product 1', price: '10.99' }])
        });

        const { getByText } = render(<ProductList />);
        const deleteButton = getByText('Delete');

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/products/1', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
        });
    });

    it('should handle errors when fetching products', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            statusText: 'Internal Server Error'
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<ProductList />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching products:', new Error('Failed to fetch products'));
        });

        consoleErrorSpy.mockRestore();
    });

    it('should handle errors when deleting a product', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Failed to delete product'));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<ProductList />);
        const deleteButton = screen.getByText('Delete');

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting product:', new Error('Failed to delete product'));
        });

        consoleErrorSpy.mockRestore();
    });
});
