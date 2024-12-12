import React, { useEffect, useState } from 'react';
import { auth, db } from '../../Components/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface CartItem {
  id: string;
  Nazwa: string;
  Cena: number;
  Specyfikacja: string;
  Image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        const cartRef = collection(db, 'carts', user.uid, 'items');
        const cartSnapshot = await getDocs(cartRef);
        const cartList = cartSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, Cena: parseInt(data.Cena, 10) } as CartItem;
        });
        setCartItems(cartList);
        calculateTotalPrice(cartList);
      }
    };

    fetchCartItems();
  }, [user]);

  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.Cena, 0);
    setTotalPrice(total);
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const productRef = doc(db, 'carts', user.uid, 'items', productId);
        await deleteDoc(productRef);
        const updatedCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems);
        console.log("Product removed from cart:", productId);
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    } else {
      console.log("User is not authenticated");
    }
  };

  const handlePurchase = () => {
    // Implement purchase logic here
    console.log("Purchase completed");
  };

  return (
    <div className='bg-white'>
      <div className="p-6 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul className="list-none p-0">
              {cartItems.map((item, index) => (
                <li className="border border-black rounded-xl p-3 m-2 flex items-center" key={index}>
                  <img src={item.Image} alt={item.Nazwa} className="w-16 h-16 object-cover mr-4" />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.Nazwa}</h2>
                    <p>{item.Cena} PLN</p>
                    <p className="text-sm">{item.Specyfikacja}</p>
                  </div>
                  <button className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700" onClick={() => removeFromCart(item.id)}>usun</button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h3 className="text-xl font-bold">Total: {totalPrice} PLN</h3>
              <button className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 mt-4" onClick={handlePurchase}>kup</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;