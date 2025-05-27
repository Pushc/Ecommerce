const BASE_URL="http://localhost:8080";

async function loadProducts()
{
    try {
        const raw = await fetch(`${BASE_URL}/products`);
        const response = await raw.json();

        let trendingList = document.getElementById("trending-products");
        let clothingList = document.getElementById("clothing-products");
        let electronicsList = document.getElementById("electronics-products");
        let gadgets = document.getElementById("gadgets");

        trendingList.innerHTML="";
        clothingList.innerHTML="";
        electronicsList.innerHTML="";
        gadgets.innerHTML="";

        response.forEach((element) => {
            
            let productCard = `
                <div class="col-lg-4 col-md-6 mb-5">
                    <div class="card h-100">
                        <img src="${element.imageUrl}" class="card-img-top" alt="${element.name}">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <p class="card-text">${element.description}</p>
                            <p class="card-text"><strong>₹${element.price}</strong></p>
                            <button class="btn btn-primary w-100" onclick="addToCart(${element.id},'${element.name}',${element.price},'${element.imageUrl}')">Add To Cart</button>
                        </div>
                    </div>
                </div> `

            if(element.category === "Clothing" || element.category === "Sweatshirt" || element.category === "Jacket")
            {
                clothingList.innerHTML+=productCard;
            }else if(element.category === "Electronics" || element.category === "Television" || element.category === "Washing Machine" || element.category === "Smart Watch" || element.category === "Printer" || element.category === "Tab" || element.category === "Refrigerator"){
                electronicsList.innerHTML+=productCard;
            }else if(element.category === "Bluetooth Speaker" || element.category === "Camera" || element.category === "Vr headset")
            {
                gadgets.innerHTML+=productCard;
            }
            else{
                trendingList.innerHTML+=productCard;
            }
        });

        console.log(response);   
    } catch (error) {
        console.log("Error Fetching Products.....");
        console.log(error); 
    }  
}