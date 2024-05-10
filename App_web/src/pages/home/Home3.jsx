import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from 'react-router-dom'
import ViewCategory from "../../components/category/ViewCategory";

async function fetchRecipesByCategoryFromFirestore(categoryName) {
    const q = query(collection(db, "recipes"), where("category", "==", categoryName));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data()});
    });
    return data;
}

const Home3 = () => {
    const [recipesData, setRecipesData] = useState([]);
    const { categoryName } = useParams();

    useEffect(() => {
        async function fetchData(){
            if (categoryName) {
                const recipes = await fetchRecipesByCategoryFromFirestore(categoryName);
                setRecipesData(recipes);
            }
        }
        fetchData();
    }, [categoryName]);
   

    return (
        <ViewCategory categoryName={categoryName} recipesData={recipesData} />
    );
};

export default Home3;
