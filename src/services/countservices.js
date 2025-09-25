// ------------------------
// Count Orders
// Route: GET /api/countorder → BDashboardController@orderStats
// ------------------------
export async function fetchCountOrder() {
    const res = await fetch(`http://127.0.0.1:8000/api/countorder`);
    return await res.json();   
    
}


// ------------------------
// Sum Orders (Total Money)
// Route: GET /api/summoneyorder → BDashboardController@totalByMonth
// ------------------------
export async function fetchSumOrder() {
    const res = await fetch(`http://127.0.0.1:8000/api/summoneyorder`);
    return await res.json();   
 
}

// ------------------------
// Sum AnotherPays
// Route: GET /api/anotherpaysum → BDashboardController@totalByMonthAnother
// ------------------------
export async function fetchSumAnother() {
    const res = await fetch(`http://127.0.0.1:8000/api/anotherpaysum`);
    return await res.json();    
}



// Count Product From Route: Route::get('productactive', [BDashbordController::class, 'countProduct']);
export async function fetchCountAnother(){
    const res = await fetch(`http://127.0.0.1:8000/api/anotherpaycount`);
    return await res.json();
}

// Count Product From Route: Route::get('productactive', [BDashbordController::class, 'countProduct']);
export async function fetchCountProducts(){
    const res = await fetch('http://127.0.0.1:8000/api/productactive');
      if (!res.ok) throw new Error("Failed to fetch product counts");
    return await res.json();
}
// Sumdiscount from route: Route::get('sumdiscount', [BOrdersController::class, 'countDiscount']);
const discouts = 'http://127.0.0.1:8000/api/sumdiscount';


export async function fetchDiscoutOrders(){
    const res = await fetch(discouts);
    return await res.json();
}