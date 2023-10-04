import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';


const ReportDetailPage = ({ match }) => {
  const [report, setReport] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchReport = async () => {
      if (id) { // only fetch if id is available
        try {
          const response = await fetch(`/api/report/report?reportId=${id}`);
          if (response.ok) {
            const data = await response.json();
            setReport(data);
          } else {
            console.error("Error fetching report:", response.statusText);
          }
        } catch (error) {
          console.error("There was an error fetching the report", error);
        }
      }
    };

    fetchReport();
  }, [id]);

  const deletePost = async () => {
    const reportId = report._id;
    const postId = report.receipeDetails.postId;
    const adminId = report.adminId;

    try {
      const response = await fetch('/api/report/deleteReportandResolve', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, reportId, adminId })
      });

      if (response.ok) {
        const result = await response.json();

        // Assuming the server returns a message in { message: 'some message' }
        alert(result.message);
        router.reload(); 

        // Navigate the user to another page or refresh the current page
        // For example, using Next.js router
        // router.push('/some-page');

      } else {
        const result = await response.json();
        alert(`Error: ${result.error || 'Something went wrong'}`);
      }

    } catch (error) {
      console.error("There was an error deleting the post:", error);
      alert('There was an error deleting the post.');
    }

  };

  return (
    <div className='container-fluid'>
      <div className='row vh-100'>
        <div
          className='col-sm'
          style={{
            padding: '20px',
            backgroundColor: '#eceeee',
            height: '90%',
            overflowY: 'auto',
            color: 'black'
          }}
        >
          {report && (
            <div>
              <h4>Report Details</h4>
              {/* Omit the reportedBy field */}
              <p><strong>Reason:</strong> {report.reason}</p>
              <p><strong>Additional Details:</strong> {report.additionalDetails}</p>
              <p><strong>Admin Comment:</strong> {report.adminComment}</p>

              <h4>Reported Post Details</h4>
              <p><strong>Recipe Name:</strong> {report.receipeDetails.name}</p>
              <p><strong>Description:</strong> {report.receipeDetails.description}</p>
              <p><strong>prepTime:</strong> {report.receipeDetails.prepTime}</p>
              <p><strong>servings:</strong> {report.receipeDetails.servings}</p>
              <p><strong>cookTime:</strong> {report.receipeDetails.cookTime}</p>
              <p><strong>origin:</strong> {report.receipeDetails.origin}</p>
              <p><strong>taste:</strong> {report.receipeDetails.taste}</p>
              <p><strong>mealtype:</strong> {report.receipeDetails.mealtype}</p>
              <p><strong>instruction:</strong> {report.receipeDetails.instruction}</p>
              {/* ... other recipe details fields ... */}

              {/* Ingredients */}
              <p><strong>Ingredients:</strong></p>
              <ul>
                {report.receipeDetails.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {`${ingredient.name} - ${ingredient.quantity}${ingredient.unit} (${ingredient.category})`}
                  </li>
                ))}
              </ul>

              {/* Image */}
              <p><strong>Recipe Image:</strong></p>
              {report.receipeDetails.recipeimageUrl && (
                <Image className='recipe-picture'
                 width = {360} height = {300} priority
                  src={report.receipeDetails.recipeimageUrl}
                  alt='Recipe' />
              )}
              <br></br>
              {/* Edit and Delete buttons */}
              <button style={{
                backgroundColor: '#0b5ed7',
                padding: '5px',
                borderRadius: '10%',
                margin: '10px'
              }}>Edit Post</button>
              <button onClick={deletePost} style={{
                backgroundColor: 'red',
                padding: '5px',
                borderRadius: '10%',

              }}>Delete Post</button>
            </div>
          )}
        </div></div></div>
  );

};

export default ReportDetailPage;
