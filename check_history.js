document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  const list = document.getElementById("history-list");
  if (!list) {
    console.error("Element with ID 'history-list' not found.");
    return;
  }

  if (!userId) {
    list.innerHTML = "<li>User ID missing. Please login again.</li>";
    return;
  }

  fetch(`/api/history/user/${userId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      list.innerHTML = "";

      if (!data || data.length === 0) {
        list.innerHTML = "<li>No completed rides found.</li>";
        return;
      }

      data.forEach(booking => {
        const li = document.createElement("li");
        const formattedDate = new Date(booking.date).toLocaleDateString();
        li.textContent = `From ${booking.pickupLocation} to ${booking.dropLocation} on ${formattedDate} — Status: ${booking.status}`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Failed to fetch history:", err);
      list.innerHTML = "<li>Error fetching history. Please try again later.</li>";
    });
});
