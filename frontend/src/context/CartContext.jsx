import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.items.find(i => i.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter(i => i.id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(i =>
                    i.id === action.payload.id
                        ? { ...i, quantity: Math.max(1, action.payload.quantity) }
                        : i
                ),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

const getInitialState = () => {
    try {
        const saved = localStorage.getItem('shopzone-cart');
        return saved ? JSON.parse(saved) : { items: [] };
    } catch {
        return { items: [] };
    }
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, null, getInitialState);

    useEffect(() => {
        localStorage.setItem('shopzone-cart', JSON.stringify(state));
    }, [state]);

    const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQuantity = (id, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart: state, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
