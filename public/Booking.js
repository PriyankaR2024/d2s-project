document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

//  const userId = document.getElementById('userId').value.trim();
  const pickupLocation = document.getElementById('pickupLocation').value.trim();
  const dropLocation = document.getElementById('dropLocation').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const vehicleType = document.getElementById('vehicleType').value;

  try {
    const res = await fetch('/api/bookings/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       // userId,
        pickupLocation,
        dropLocation,
        date,
        time,
        vehicleType,
        status: 'Pending',
      }),
    });

    const result = await res.json();

    if (res.ok) {
      const driverId = result.driverId || 'Not assigned yet';
      alert(`Ride booked successfully!\nAssigned Driver ID: ${driverId}`);
      localStorage.setItem('lastBooking', JSON.stringify(result)); // Optional for future use
      document.getElementById('bookingForm').reset();
    } else {
      console.err('Booking failed:', result.message);
      alert(result.message || 'Failed to book the ride.');
    }
  } catch (err) {
    alert('Booking failed. Please try again later.');
    console.err('Network or server error:', err);
  }
});
