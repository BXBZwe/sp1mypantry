/*import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const MealPlanDetail = () => {
    const router = useRouter();
    const { id } = router.query;  // This extracts the 'id' parameter from the URL

    const [mealPlan, setMealPlan] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    const fetchmealplandetail = async () => {
        if (!id) return;

        const token = localStorage.getItem('token'); 

        // Fetch the specific meal plan by ID (or date in your case)
        fetch(`/api/mealplanner/mealplanner/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            setMealPlan(data);
        });

        // Assuming you also want to display the recipes by their names
        fetch('/api/wishlist/getwishlist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            setWishlist(data);
        });

    }

    useEffect(() => {
        fetchmealplandetail();
    }, [id]);

    if (!mealPlan) return <p>Loading...</p>;

    return (
        <div>
            <h2>{id} Meal Plan</h2>
            {Object.keys(mealPlan).map(date => (
                <div key={date}>
                    <strong>{date}</strong>
                    <ul>
                        {Object.keys(mealPlan[date]).map(mealType => {
                            const recipe = wishlist.find(r => r._id === mealPlan[date][mealType]);
                            return <li key={mealType}>{mealType}: {recipe ? recipe.name : 'Unknown'}</li>;
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default MealPlanDetail; */
