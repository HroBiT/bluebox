"use client";

import React, { useEffect, useState } from 'react';
import Card from '../../Components/Card';
import { auth, db } from '../../Components/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface CardData {
  Nazwa: string;
  Cena: number;
  Specyfikacja: string;
  Image: string;
}

function Home() {
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardsData = async () => {
      const cardsCollection = collection(db, 'cards');
      const cardsSnapshot = await getDocs(cardsCollection);
      const cardsList = cardsSnapshot.docs.map(doc => doc.data() as CardData);
      setCardsData(cardsList);
    };

    fetchCardsData();
  }, []);

  const addToCart = async (product: CardData) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const cartRef = collection(db, 'carts', user.uid, 'items');
        await addDoc(cartRef, product);
        console.log("Product added to cart:", product);
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      console.log("User is not authenticated");
    }
  };

  const goToDetails = (product: CardData) => {
    navigate(`/details/${product.Nazwa}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-6xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              Nazwa={card.Nazwa}
              Cena={card.Cena}
              Specyfikacja={card.Specyfikacja}
              Image={card.Image}
              addToCart={addToCart}
              goToDetails={() => goToDetails(card)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;