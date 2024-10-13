const apiBaseUrl = 'https://competeboard-server-a7emfubta3a0h4d0.canadacentral-01.azurewebsites.net//api';
let authToken = '';  // Store JWT token after login

// Check if token exists in localStorage
if (localStorage.getItem('authToken')) {
    authToken = localStorage.getItem('authToken');
}

// Register User
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const codeforces = document.getElementById('registerCodeforces').value;
        const codechef = document.getElementById('registerCodechef').value;
        const leetcode = document.getElementById('registerLeetcode').value;

        const body = JSON.stringify({
            username:username,
            password:password,
            codeforcesHandle: codeforces,
            codechefHandle: codechef,
            leetcodeHandle: leetcode
        });

        try {
            const response = await fetch(`${apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });

            const result = await response.json();
            console.log('Register Result:', result);
            alert('User Registered! Please login.');
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        }
    });
}

// Login User
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const body = JSON.stringify({ username, password });

        try {
            const response = await fetch(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });

            const result = await response.json();
            console.log('Login Result:', result);

            if (result.token) {
                authToken = result.token;  // Save JWT token
                localStorage.setItem('authToken', authToken);  // Store the token in localStorage
                alert('Login Successful! Redirecting to profile page...');
                window.location.href = 'profile.html';  // Redirect to profile page after login
            } else {
                alert('Login Failed! Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        }
    });
}

// Function to create a new chart or update an existing one
function createChart(ctx, type, data, options) {
    if (ctx.chart) {
        ctx.chart.destroy(); // Destroy the previous chart
    }
    ctx.chart = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

// Get Profiles Data (after login)
// document.getElementById('getProfilesButton').addEventListener('click', async () => {
//     if (!authToken) {
//         alert('Please login first!');
//         return;
//     }

//     try {
//         const response = await fetch(`${apiBaseUrl}/profile/profiles-data`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`
//             }
//         });

//         const profilesData = await response.json();
//         console.log('Profiles Data:', profilesData);
//         alert('Data fetched successfully!');

//         const ctxSolved = document.getElementById('problemSolvedChart').getContext('2d');
//         const ctxLeetCode = document.getElementById('leetcodeSubmissionsChart').getContext('2d');
//         const ctxCodeChef = document.getElementById('codechefRatingChart').getContext('2d');
//         const ctxVerdict = document.getElementById('verdictDistribution').getContext('2d');
//         const ctxRating = document.getElementById('ratingProgression').getContext('2d');

//         // Ensure the data exists before accessing it
//         if (!profilesData.codeforces) {
//             alert('Codeforces data is not available.');
//             return;
//         }

//         // Extract Codeforces rating data
//         const codeforcesRatingData = profilesData.codeforces.rating.result.map(rating => ({
//             contestName: rating.contestName,
//             newRating: rating.newRating
//         }));

//         // Prepare labels and data for the chart
//         const labels = codeforcesRatingData.map(r => r.contestName);
//         const ratings = codeforcesRatingData.map(r => r.newRating);

//         // Codeforces Ratings Chart
//         createChart(ctxRating, 'line', {
//             labels: labels,
//             datasets: [{
//                 label: 'Codeforces Ratings',
//                 data: ratings,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 2,
//                 fill: true,
//                 tension: 0.1
//             }]
//         }, {
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Contest Name',
//                         color: '#ffffff' // White color for X-axis title
//                     },
//                     ticks: {
//                         autoSkip: true,
//                         maxTicksLimit: 10,
//                         color: '#ffffff' // White color for X-axis ticks
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Rating',
//                         color: '#ffffff' // White color for Y-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff', // White color for Y-axis ticks
//                         beginAtZero: true
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: '#ffffff' // White color for legend labels
//                     }
//                 },
//                 tooltip: {
//                     titleColor: '#ffffff', // White color for tooltip title
//                     bodyColor: '#ffffff'   // White color for tooltip body text
//                 }
//             }
//         });
        

//         // Problem Solved Chart (Codeforces)
//         createChart(ctxSolved, 'bar', {
//             labels: ['<1000', '1000-2000', '>2000'],
//             datasets: [{
//                 label: 'Problems Solved',
//                 data: [
//                     profilesData.codeforces.problemSolved['<1000'],
//                     profilesData.codeforces.problemSolved['1000-2000'],
//                     profilesData.codeforces.problemSolved['>2000']
//                 ],
//                 backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
//                 borderColor: ['#388e3c', '#1976d2', '#f57c00'],
//                 borderWidth: 1
//             }]
//         }, {
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Rating Range',
//                         color: '#ffffff' // White color for X-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff' // White color for X-axis ticks
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Number of Problems Solved',
//                         color: '#ffffff' // White color for Y-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff', // White color for Y-axis ticks
//                         beginAtZero: true
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: '#ffffff' // White color for legend labels
//                     }
//                 },
//                 tooltip: {
//                     titleColor: '#ffffff', // White color for tooltip title
//                     bodyColor: '#ffffff'   // White color for tooltip body text
//                 }
//             }
//         });
        

//         // LeetCode Submissions Chart
//         const leetcodeSubmissionStats = profilesData.leetcode.submissionStats.map(stat => stat.count);
//         const leetcodeLabels = profilesData.leetcode.submissionStats.map(stat => stat.difficulty);

//         createChart(ctxLeetCode, 'pie', {
//             labels: leetcodeLabels,
//             datasets: [{
//                 label: 'LeetCode Submission Stats',
//                 data: leetcodeSubmissionStats,
//                 backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
//                 hoverOffset: 4
//             }]
//         }, {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: '#ffffff' // White color for legend labels
//                     }
//                 },
//                 tooltip: {
//                     titleColor: '#ffffff', // White color for tooltip title
//                     bodyColor: '#ffffff'   // White color for tooltip body text
//                 }
//             }
//         });
        

//         // CodeChef Ratings Chart
//         const codechefRatings = profilesData.codechef.ratingData.map(r => r.rating);
//         const codechefContestNames = profilesData.codechef.ratingData.map(r => r.name);

//         createChart(ctxCodeChef, 'line', {
//             labels: codechefContestNames,
//             datasets: [{
//                 label: 'CodeChef Ratings',
//                 data: codechefRatings,
//                 backgroundColor: '#42a5f5',
//                 borderColor: '#1e88e5',
//                 borderWidth: 1
//             }]
//         }, {
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Contest Names',
//                         color: '#ffffff' // White color for X-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff' // White color for X-axis ticks
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Ratings',
//                         color: '#ffffff' // White color for Y-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff', // White color for Y-axis ticks
//                         beginAtZero: true
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: '#ffffff' // White color for legend labels
//                     }
//                 },
//                 tooltip: {
//                     titleColor: '#ffffff', // White color for tooltip title
//                     bodyColor: '#ffffff'   // White color for tooltip body text
//                 }
//             }
//         });
        

//         // Verdict Distribution Chart
//         const verdictResults = profilesData.codeforces.submissions || []; // Use empty array if undefined
//         const verdictCounts = verdictResults.reduce((acc, result) => {
//             acc[result.verdict] = (acc[result.verdict] || 0) + 1;
//             return acc;
//         }, {});

//         createChart(ctxVerdict, 'bar', {
//             labels: Object.keys(verdictCounts),
//             datasets: [{
//                 label: 'Problem Verdicts',
//                 data: Object.values(verdictCounts),
//                 backgroundColor: '#ff6384',
//                 borderColor: '#cc65fe',
//                 borderWidth: 1
//             }]
//         }, {
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Verdict',
//                         color: '#ffffff' // White color for X-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff' // White color for X-axis ticks
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Count',
//                         color: '#ffffff' // White color for Y-axis title
//                     },
//                     ticks: {
//                         color: '#ffffff', // White color for Y-axis ticks
//                         beginAtZero: true
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: '#ffffff' // White color for legend labels
//                     }
//                 },
//                 tooltip: {
//                     titleColor: '#ffffff', // White color for tooltip title
//                     bodyColor: '#ffffff'   // White color for tooltip body text
//                 }
//             }
//         });
        

//         // Tags Distribution Chart
//         if (document.getElementById('tagsDistribution')) {
//             const ctxTags = document.getElementById('tagsDistribution').getContext('2d');
            
//             // Assuming verdictResults is available and populated with submission data
//             const tagsCounts = {};

//             // Calculate the frequency of each tag
//             verdictResults.forEach(result => {
//                 if (result.problem && result.problem.tags) {
//                     result.problem.tags.forEach(tag => {
//                         tagsCounts[tag] = (tagsCounts[tag] || 0) + 1;
//                     });
//                 }
//             });

//             // Create the Tags Distribution Chart
//             createChart(ctxTags, 'pie', {
//                 labels: Object.keys(tagsCounts), // Problem tags
//                 datasets: [{
//                     data: Object.values(tagsCounts), // Frequency of each tag
//                     backgroundColor: [
//                         '#ff6384', 
//                         '#36a2eb', 
//                         '#cc65fe', 
//                         '#ffce56', 
//                         '#4caf50',
//                         '#2196f3'
//                     ], // Customize colors as needed
//                     borderWidth: 1
//                 }]
//             }, {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                         labels: {
//                             color: '#ffffff' // White color for legend labels
//                         }
//                     },
//                     tooltip: {
//                         callbacks: {
//                             label: (context) => `${context.label}: ${context.raw}`,
//                             titleColor: '#ffffff', // White color for tooltip title
//                             bodyColor: '#ffffff'   // White color for tooltip body text
//                         }
//                     }
//                 }
//             });
            
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         alert('Failed to fetch profiles data. Please try again.');
//     }
// });
document.addEventListener('DOMContentLoaded', async () => {
    const getProfilesButton = document.getElementById('getProfilesButton');

    if (getProfilesButton) {
        
            if (!authToken) {
                        alert('Please login first!');
                        return;
                    }
                
                    try {
                        const response = await fetch(`${apiBaseUrl}/profile/profiles-data`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${authToken}`
                            }
                        });
                
                        const profilesData = await response.json();
                        console.log('Profiles Data:', profilesData);
                        // alert('Data fetched successfully!');
                
                        const ctxSolved = document.getElementById('problemSolvedChart').getContext('2d');
                        const ctxLeetCode = document.getElementById('leetcodeSubmissionsChart').getContext('2d');
                        const ctxCodeChef = document.getElementById('codechefRatingChart').getContext('2d');
                        const ctxVerdict = document.getElementById('verdictDistribution').getContext('2d');
                        const ctxRating = document.getElementById('ratingProgression').getContext('2d');
                
                        // Ensure the data exists before accessing it
                        if (!profilesData.codeforces) {
                            alert('Codeforces data is not available.');
                            return;
                        }
                
                        // Extract Codeforces rating data
                        const codeforcesRatingData = profilesData.codeforces.rating.result.map(rating => ({
                            contestName: rating.contestName,
                            newRating: rating.newRating
                        }));
                
                        // Prepare labels and data for the chart
                        const labels = codeforcesRatingData.map(r => r.contestName);
                        const ratings = codeforcesRatingData.map(r => r.newRating);
                
                        // Codeforces Ratings Chart
                        createChart(ctxRating, 'line', {
                            labels: labels,
                            datasets: [{
                                label: 'Codeforces Ratings',
                                data: ratings,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.1
                            }]
                        }, {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Contest Name',
                                        color: '#ffffff' // White color for X-axis title
                                    },
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 10,
                                        color: '#ffffff' // White color for X-axis ticks
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Rating',
                                        color: '#ffffff' // White color for Y-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff', // White color for Y-axis ticks
                                        beginAtZero: true
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#ffffff' // White color for legend labels
                                    }
                                },
                                tooltip: {
                                    titleColor: '#ffffff', // White color for tooltip title
                                    bodyColor: '#ffffff'   // White color for tooltip body text
                                }
                            }
                        });
                        
                
                        // Problem Solved Chart (Codeforces)
                        createChart(ctxSolved, 'bar', {
                            labels: ['<1000', '1000-2000', '>2000'],
                            datasets: [{
                                label: 'Problems Solved',
                                data: [
                                    profilesData.codeforces.problemSolved['<1000'],
                                    profilesData.codeforces.problemSolved['1000-2000'],
                                    profilesData.codeforces.problemSolved['>2000']
                                ],
                                backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
                                borderColor: ['#388e3c', '#1976d2', '#f57c00'],
                                borderWidth: 1
                            }]
                        }, {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Rating Range',
                                        color: '#ffffff' // White color for X-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff' // White color for X-axis ticks
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Number of Problems Solved',
                                        color: '#ffffff' // White color for Y-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff', // White color for Y-axis ticks
                                        beginAtZero: true
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#ffffff' // White color for legend labels
                                    }
                                },
                                tooltip: {
                                    titleColor: '#ffffff', // White color for tooltip title
                                    bodyColor: '#ffffff'   // White color for tooltip body text
                                }
                            }
                        });
                        
                
                        // LeetCode Submissions Chart
                        const leetcodeSubmissionStats = profilesData.leetcode.submissionStats.map(stat => stat.count);
                        const leetcodeLabels = profilesData.leetcode.submissionStats.map(stat => stat.difficulty);
                
                        createChart(ctxLeetCode, 'pie', {
                            labels: leetcodeLabels,
                            datasets: [{
                                label: 'LeetCode Submission Stats',
                                data: leetcodeSubmissionStats,
                                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
                                hoverOffset: 4
                            }]
                        }, {
                            responsive: true,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#ffffff' // White color for legend labels
                                    }
                                },
                                tooltip: {
                                    titleColor: '#ffffff', // White color for tooltip title
                                    bodyColor: '#ffffff'   // White color for tooltip body text
                                }
                            }
                        });
                        
                
                        // CodeChef Ratings Chart
                        const codechefRatings = profilesData.codechef.ratingData.map(r => r.rating);
                        const codechefContestNames = profilesData.codechef.ratingData.map(r => r.name);
                
                        createChart(ctxCodeChef, 'line', {
                            labels: codechefContestNames,
                            datasets: [{
                                label: 'CodeChef Ratings',
                                data: codechefRatings,
                                backgroundColor: '#42a5f5',
                                borderColor: '#1e88e5',
                                borderWidth: 1
                            }]
                        }, {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Contest Names',
                                        color: '#ffffff' // White color for X-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff' // White color for X-axis ticks
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Ratings',
                                        color: '#ffffff' // White color for Y-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff', // White color for Y-axis ticks
                                        beginAtZero: true
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#ffffff' // White color for legend labels
                                    }
                                },
                                tooltip: {
                                    titleColor: '#ffffff', // White color for tooltip title
                                    bodyColor: '#ffffff'   // White color for tooltip body text
                                }
                            }
                        });
                        
                
                        // Verdict Distribution Chart
                        const verdictResults = profilesData.codeforces.submissions || []; // Use empty array if undefined
                        const verdictCounts = verdictResults.reduce((acc, result) => {
                            acc[result.verdict] = (acc[result.verdict] || 0) + 1;
                            return acc;
                        }, {});
                
                        createChart(ctxVerdict, 'bar', {
                            labels: Object.keys(verdictCounts),
                            datasets: [{
                                label: 'Problem Verdicts',
                                data: Object.values(verdictCounts),
                                backgroundColor: '#ff6384',
                                borderColor: '#cc65fe',
                                borderWidth: 1
                            }]
                        }, {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Verdict',
                                        color: '#ffffff' // White color for X-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff' // White color for X-axis ticks
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Count',
                                        color: '#ffffff' // White color for Y-axis title
                                    },
                                    ticks: {
                                        color: '#ffffff', // White color for Y-axis ticks
                                        beginAtZero: true
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#ffffff' // White color for legend labels
                                    }
                                },
                                tooltip: {
                                    titleColor: '#ffffff', // White color for tooltip title
                                    bodyColor: '#ffffff'   // White color for tooltip body text
                                }
                            }
                        });
                        
                
                        // Tags Distribution Chart
                        if (document.getElementById('tagsDistribution')) {
                            const ctxTags = document.getElementById('tagsDistribution').getContext('2d');
                            
                            // Assuming verdictResults is available and populated with submission data
                            const tagsCounts = {};
                
                            // Calculate the frequency of each tag
                            verdictResults.forEach(result => {
                                if (result.problem && result.problem.tags) {
                                    result.problem.tags.forEach(tag => {
                                        tagsCounts[tag] = (tagsCounts[tag] || 0) + 1;
                                    });
                                }
                            });
                
                            // Create the Tags Distribution Chart
                            createChart(ctxTags, 'pie', {
                                labels: Object.keys(tagsCounts), // Problem tags
                                datasets: [{
                                    data: Object.values(tagsCounts), // Frequency of each tag
                                    backgroundColor: [
                                        '#ff6384', 
                                        '#36a2eb', 
                                        '#cc65fe', 
                                        '#ffce56', 
                                        '#4caf50',
                                        '#2196f3'
                                    ], // Customize colors as needed
                                    borderWidth: 1
                                }]
                            }, {
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            color: '#ffffff' // White color for legend labels
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.raw}`,
                                            titleColor: '#ffffff', // White color for tooltip title
                                            bodyColor: '#ffffff'   // White color for tooltip body text
                                        }
                                    }
                                }
                            });
                            
                        }
                
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Failed to fetch profiles data. Please try again.');
                    }
        ;
    }
});
// Update User Handles
if (document.getElementById('updateHandlesForm')) {
    document.getElementById('updateHandlesForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (!authToken) {
            alert('Please login first!');
            return;
        }

        const codeforces = document.getElementById('updateCodeforces').value;
        const codechef = document.getElementById('updateCodechef').value;
        const leetcode = document.getElementById('updateLeetcode').value;

        const body = JSON.stringify({
            codeforces,
            codechef,
            leetcode
        });

        try {
            const response = await fetch(`${apiBaseUrl}/profile/userhandles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body
            });

            const result = await response.json();
            console.log('Update Handles Result:', result);
            alert('User handles updated successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update user handles. Please try again.');
        }
    });
}
