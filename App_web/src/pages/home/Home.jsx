import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import { useDispatch } from "react-redux";
import { storeProducts, getPriceRange } from "../../redux/slice/productSlice";
import Hero from "../../components/hero/Hero";
import "../../general.css"

async function fetchDataFromFirestore(collectionName) {
	const querySnapshot = await getDocs(collection(db, collectionName))

	const data = [];
	querySnapshot.forEach((doc) => {
		data.push({ id: doc.id, ...doc.data()});
	});
	return data;
}

const Home = () => {
	const dispatch = useDispatch();
	const [productsData, setProductsData] = useState([]);
	const [recipesData, setRecipesData] = useState([]);

	useEffect(() => {
		async function fetchData(){
			const products = await fetchDataFromFirestore("products");
			setProductsData(products);
			const recipes = await fetchDataFromFirestore("recipes");
			setRecipesData(recipes);
		}
		fetchData();
		dispatch(storeProducts({ products: productsData }));
		dispatch(getPriceRange({ products: productsData }));
	}, [dispatch]);

	return (
		<div>
			<Hero recipesData={recipesData}/>
		</div>
	);
};

export default Home;