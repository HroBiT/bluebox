import React from 'react';

interface CardProps {
  Nazwa: string;
  Cena: number;
  Specyfikacja: string;
  Image: string;
  addToCart: (product: { Nazwa: string; Cena: number; Specyfikacja: string; Image: string }) => void;
  goToDetails: () => void;
}

const Card: React.FC<CardProps> = ({ Nazwa, Cena, Specyfikacja, Image, addToCart, goToDetails }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col w-full">
      <img src={Image} alt={Nazwa} className="w-full h-32 object-cover" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{Nazwa}</h3>
          <p className="text-gray-600 mt-2">{Specyfikacja}</p>
          <p className="text-gray-800 font-bold mt-2">{Cena} PLN</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => addToCart({ Nazwa, Cena, Specyfikacja, Image })}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
           Dodaj do koszyka
          </button>
          <button
            onClick={goToDetails}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Przejdź do szczegółów
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;