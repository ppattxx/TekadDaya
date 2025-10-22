import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Product, User, CartItem, Cart } from "../types";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: Cart;
  loading: boolean;
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "UPDATE_CART_ITEM"; payload: { id: number; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: Cart };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: {
    items: [],
    total: 0,
    itemCount: 0,
  },
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.items.find((item) => item.product.id === product.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.cart.items.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        newItems = [...state.cart.items, { id: Date.now(), product, quantity }];
      }

      const total = newItems.reduce((sum, item) => sum + item.product.harga * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cart: {
          items: newItems,
          total,
          itemCount,
        },
      };
    }

    case "UPDATE_CART_ITEM": {
      const { id, quantity } = action.payload;
      const newItems = quantity > 0 ? state.cart.items.map((item) => (item.id === id ? { ...item, quantity } : item)) : state.cart.items.filter((item) => item.id !== id);

      const total = newItems.reduce((sum, item) => sum + item.product.harga * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cart: {
          items: newItems,
          total,
          itemCount,
        },
      };
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.cart.items.filter((item) => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.product.harga * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cart: {
          items: newItems,
          total,
          itemCount,
        },
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: {
          items: [],
          total: 0,
          itemCount: 0,
        },
      };

    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
      };

    default:
      return state;
  }
}

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
    }
  | undefined
>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}

export const actions = {
  setUser: (user: User | null): AppAction => ({ type: "SET_USER", payload: user }),
  setLoading: (loading: boolean): AppAction => ({ type: "SET_LOADING", payload: loading }),
  addToCart: (product: Product, quantity: number = 1): AppAction => ({ type: "ADD_TO_CART", payload: { product, quantity } }),
  updateCartItem: (id: number, quantity: number): AppAction => ({ type: "UPDATE_CART_ITEM", payload: { id, quantity } }),
  removeFromCart: (id: number): AppAction => ({ type: "REMOVE_FROM_CART", payload: id }),
  clearCart: (): AppAction => ({ type: "CLEAR_CART" }),
  setCart: (cart: Cart): AppAction => ({ type: "SET_CART", payload: cart }),
};
