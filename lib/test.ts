const response = 
`@@json
[
    {
        "Type": "Book",
        "Name": "The Space Barons: Elon Musk, Jeff Bezos, and the Quest to Colonize the Cosmos",
        "Link": "https://www.amazon.com/dp/1610398297"
    },
    {
        "Type": "Course",
        "Name": "Space Exploration and Rocket Science",
        "Link": "https://www.coursera.org/learn/space-exploration"
    },
    {
        "Type": "Video",
        "Name": "Starship: The Future of Space Travel",
        "Link": "https://www.youtube.com/watch?v=abcd1234efg"
    },
    {
        "Type": "Product",
        "Name": "Celestron AstroMaster 70AZ Telescope",
        "Link": "https://www.amazon.com/dp/B000MLHMAS"
    }
]
@@`
const jsonString = response.slice(7, -3);
const jsonArray = JSON.parse(jsonString);
console.log(jsonArray);