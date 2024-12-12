import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../Components/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface Product {
  id?: string;
  Nazwa: string;
  Cena: number;
  Specyfikacja: string;
  Image: string;
}

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    Nazwa: '',
    Cena: 0,
    Specyfikacja: '',
    Image: 'kobieta.jpg',
  });
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, 'cards');
      const productsSnapshot = await getDocs(productsRef);
      const productsList = productsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as Product;
      });
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const addProduct = async () => {
    try {
      const productsRef = collection(db, 'cards');
      const newProductWithImage = { ...newProduct };
      const addedDoc = await addDoc(productsRef, newProductWithImage);
      setProducts([...products, { id: addedDoc.id, ...newProductWithImage }]);
      setNewProduct({ Nazwa: '', Cena: 0, Specyfikacja: '', Image: 'kobieta.jpg' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const removeProduct = async (productId: string) => {
    try {
      const productRef = doc(db, 'cards', productId);
      await deleteDoc(productRef);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.Nazwa}
          onChange={(e) => setNewProduct({ ...newProduct, Nazwa: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.Cena}
          onChange={(e) => setNewProduct({ ...newProduct, Cena: parseFloat(e.target.value) })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Specification"
          value={newProduct.Specyfikacja}
          onChange={(e) => setNewProduct({ ...newProduct, Specyfikacja: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={addProduct} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700">Add Product</button>
      </div>
      <ul className="list-none p-0">
        {products.map((product) => (
          <li className="border rounded-xl p-5 m-4 flex justify-between items-center" key={product.id}>
            <div>
              <h2 className="text-xl font-semibold">{product.Nazwa}</h2>
              <p>{product.Cena} PLN</p>
              <p>{product.Specyfikacja}</p>
              <img src={product.Image} alt={product.Nazwa} className="w-20 h-20 object-cover" />
            </div>
            <button className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700" onClick={() => removeProduct(product.id!)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
