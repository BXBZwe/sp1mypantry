import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

const MealPlanner = () => {
  const [wishlist, setWishlist] = useState([]);
  const [mealPlans, setMealPlans] = useState({});
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const fetchmealplans = async () => {
    const token = localStorage.getItem('token'); 
     // Assuming you have an API endpoint to get the user's wishlist recipes
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
        console.log("Wishlist Data:", data)
    });

    // Fetch user's meal plans
    fetch('/api/mealplanner/mealplanner', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(data => {
        setSavedMealPlans(data);
    });
}

useEffect(() => {
    fetchmealplans();
}, []);

    // Function to generate an array of days between two dates
const generateDays = (start, end) => {
    let days = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        days.push(new Date(dt));
    }
    return days;
};

const handleSetMeal = (day, mealType, recipeId) => {
    const updatedMealPlans = { ...mealPlans };
    const dateString = day.toDateString();

    if (!updatedMealPlans[dateString]) {
        updatedMealPlans[dateString] = {};
    }

    updatedMealPlans[dateString][mealType] = recipeId;
    setMealPlans(updatedMealPlans);
}

const saveMealPlans = async () => {
    const token = localStorage.getItem('token'); 

    // Generating a week identifier (you can adjust this as per your needs)
    const weekIdentifier = new Date(startDate).toISOString().split('T')[0];// Taking YYYY-MM-DD format

    const weekMealPlans = {
        weekIdentifier: weekIdentifier,
        plans: mealPlans
    };

    // Call API to persist the entire weekMealPlans
    fetch('/api/mealplanner/mealplanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(weekMealPlans)
    })
    .then(response => {
      if (response.ok) {
        console.log("Meal plans saved successfully");
        setIsCreating(false);  // Close the creation form
        return fetchmealplans();
      } else {
        console.error("Error saving meal plans:", response.statusText);
      }
    })
    .catch(error => {
      console.error("Error saving meal plans:", error);
    });
}

const displayCreationForm = () => {
    const daysBetweenDates = generateDays(new Date(startDate), new Date(endDate));

    return (
        <div>
            Start Date: <input type="date" onChange={e => setStartDate(e.target.value)} />
            End Date: <input type="date" onChange={e => setEndDate(e.target.value)} />

            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#ddd', padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}></th>
                        <th style={{ backgroundColor: '#ddd', padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Breakfast</th>
                        <th style={{ backgroundColor: '#ddd', padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Lunch</th>
                        <th style={{ backgroundColor: '#ddd', padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Dinner</th>
                    </tr>
                </thead>
                <tbody>
                    {daysBetweenDates.map(day => (
                        <tr key={day.toDateString()}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}><strong>{day.toDateString()}</strong></td>
                            {['breakfast', 'lunch', 'dinner'].map(mealType => (
                                <td key={mealType} style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    <select onChange={e => handleSetMeal(day, mealType, e.target.value)}>
                                        <option value="">Select</option>
                                        {wishlist.map(recipe => (
                                            <option key={recipe._id} value={recipe._id}>{recipe.name}</option>
                                        ))}
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={saveMealPlans}>Save Meal Plans</button>
        </div>
    );
};


const displaySavedPlans = () => (
    <div>
        {savedMealPlans.map(plan => (
            <div key={plan.weekIdentifier}>
                <h3>{plan.weekIdentifier}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Breakfast</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(plan.plans).map(dateString => {
                            const dayPlan = plan.plans[dateString];
                            return (
                                <tr key={dateString}>
                                    <td>{dateString}</td>
                                    <td>{dayPlan.breakfast ? wishlist.find(recipe => recipe._id === dayPlan.breakfast)?.name : '-'}</td>
                                    <td>{dayPlan.lunch ? wishlist.find(recipe => recipe._id === dayPlan.lunch)?.name : '-'}</td>
                                    <td>{dayPlan.dinner ? wishlist.find(recipe => recipe._id === dayPlan.dinner)?.name : '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button onClick={() => deleteMealPlan(plan._id)}>Delete</button>
            </div>
        ))}
        <button onClick={() => setIsCreating(true)}>Create New Meal Plan</button>
    </div>
);


const deleteMealPlan = async (planId) => {
    const token = localStorage.getItem('token');

    fetch(`/api/deletemealplan/${planId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("Meal plan deleted successfully");
            fetchmealplans(); // refresh the list after deletion
        } else {
            console.error("Error deleting meal plan:", response.statusText);
        }
    })
    .catch(error => {
        console.error("Error deleting meal plan:", error);
    });
}



  return (
    <>
    <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>

        <div style={{ marginRight: '10px' }}>
            <Link href="/home" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
                All menu
            </Link>
            <Link href="/planner" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
                Planner
            </Link>
            <Link href="/userpage/userProfileWL" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                Recycle
            </Link>
            <Link href="/userpage/userprofileMR" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                Profile
            </Link>
        </div>
    </nav>
    {isCreating ? displayCreationForm() : displaySavedPlans()}
    <div>
        <h2>Saved Meal Plans</h2>
    </div>


    </>
  );
}

export default MealPlanner;
