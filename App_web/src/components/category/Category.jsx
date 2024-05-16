import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const Category = ({ recipesData }) => {
    const { t } = useTranslation();

    if (!recipesData) {
        return <div>{t('Cargando...')}</div>;
    }

    const categories = recipesData.reduce((acc, recipe) => {
        if (!acc.includes(recipe.category)) {
            acc.push(recipe.category);
        }
        return acc;
    }, []);
    

    return (
        <div className="flex flex-col items-center justify-center h-screen mx-auto">
            <div className="flex flex-col items-center mb-4 mt-8">
                <h1 className="text-5xl font-bold mb-4 text-center">{t('Categorías')}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => {
                    return (
                        <div key={index} className="bg-accent p-4 rounded-lg flex flex-col items-center">
                            <h3 className="text-lg font-semibold mb-2 text-center">{t(category)}</h3>
                            <Link className='link' to={`/category/${category}`}>{t('Ver categoría')}</Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Category;
