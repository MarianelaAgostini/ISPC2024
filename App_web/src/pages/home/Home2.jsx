import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import { useDispatch } from "react-redux";
import Category from "../../components/category/Category";


async function fetchDataFromFirestore(collectionName) {
	const querySnapshot = await getDocs(collection(db, collectionName))

	const data = [];
	querySnapshot.forEach((doc) => {
		data.push({ id: doc.id, ...doc.data()});
	});
	return data;
}

const Home2 = () => {
	const dispatch = useDispatch();
	const [recipesData, setRecipesData] = useState([]);

	useEffect(() => {
		async function fetchData(){
			const recipes = await fetchDataFromFirestore("recipes");
			setRecipesData(recipes);
		}
		fetchData();
	}, [dispatch]);

	return (
		<div>
			<Category recipesData={recipesData}/>
		</div>
	);
};

export default Home2;