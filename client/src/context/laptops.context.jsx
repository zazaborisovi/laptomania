import { useContext, useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const LaptopContext = createContext();

export const useLaptop = () => useContext(LaptopContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const LaptopProvider = ({ children }) => {
  const [laptops, setLaptops] = useState(null);
  const [cart, setCart] = useState([]);

  const getLaptops = async () => {
    try {
      const res = await fetch(`${API_URL}/laptops`);

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      const result = await res.json();

      setLaptops(result);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteLaptop = async (id) => {
    const toastId = toast.loading('Deleting laptop...');

    try {
      const res = await fetch(`${API_URL}/laptops/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      setLaptops((prevLaptops) => prevLaptops.filter((laptop) => laptop._id !== id));

      toast.update(toastId, {
        render: 'Laptop deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const updateLaptop = async (id, formData) => {
    const toastId = toast.loading('Updating laptop...');

    try {
      const res = await fetch(`${API_URL}/laptops/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setLaptops((prevLaptops) => {
        const updated = [...prevLaptops];
        const index = updated.findIndex((laptop) => laptop._id === result._id);
        if (index !== -1) updated[index] = result;
        return updated;
      });

      toast.update(toastId, {
        render: 'Laptop updated successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const addLaptop = async (formData) => {
    const toastId = toast.loading('Adding laptop...');

    try {
      const res = await fetch(`${API_URL}/laptops`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setLaptops([...laptops, result]);

      toast.update(toastId, {
        render: 'Laptop added successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const addToCart = async (product) => {
    const laptop = cart.find((obj) => obj._id === product._id);
    if (laptop) {
      setCart((prevLaptops) =>
        prevLaptops.map((obj) =>
          obj._id === laptop._id ? { ...obj, quantity: obj.quantity + 1 } : obj
        )
      );
      toast.success('Added to cart');
      return;
    }
    setCart((prevLaptops) => [...prevLaptops, { ...product, quantity: 1 }]);
    toast.success('Added to cart');
  };

  const reduceOne = (product) => {
    if (product.quantity === 1) {
      setCart((prevLaptops) => prevLaptops.filter((obj) => obj._id !== product._id));
    } else {
      setCart((prevLaptops) =>
        prevLaptops.map((obj) =>
          obj._id === product._id ? { ...obj, quantity: obj.quantity - 1 } : obj
        )
      );
    }
  };

  const removeProduct = (product) => {
    setCart((prevLaptops) => prevLaptops.filter((obj) => obj._id !== product._id));
    toast.info('Removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  useEffect(() => {
    getLaptops();
  }, []);

  return (
    <LaptopContext.Provider
      value={{
        laptops,
        deleteLaptop,
        updateLaptop,
        addLaptop,
        addToCart,
        cart,
        reduceOne,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </LaptopContext.Provider>
  );
};
