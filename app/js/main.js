const farmForm = document.getElementById("farmsForm");
const farmsTable = document.querySelector("#FarmsTable tbody");
const totalFarms = document.getElementById("totalFarms");

let editingfarmId = null;

// Load all farms
async function loadFarms() {
    try {
        const res = await fetch("/api/farms");
        const farms = await res.json();

        farmsTable.innerHTML = "";
        farms.forEach(f => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${f.farm_id}</td>
                <td>${f.farm_name}</td>
                <td>${f.crop_type}</td>
                <td>${f.region}</td>
                <td>${f.responsible_technician}</td>
                <td>
                    <button onclick="editFarm(${f.farm_id})">Edit</button>
                    <button onclick="deleteFarm(${f.farm_id})">Delete</button>
                </td>
            `;
            farmsTable.appendChild(row);
        });

        totalFarms.textContent = farms.length;
    } catch (err) {
        console.error("Error loading farms:", err);
    }
}

// Create or update farm
farmForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const farmData = {
        farm_name: document.getElementById("farm_name").value,
        crop_type: document.getElementById("crop_type").value,
        region: document.getElementById("region").value,
        responsible_technician: document.getElementById("responsible_technician").value,
    };

    try {
        if (editingfarmId) {
            await fetch(`/api/farms/${editingfarmId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(farmData),
            });
            editingfarmId = null;
        } else {
            await fetch("/api/farms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(farmData),
            });
        }

        farmForm.reset();
        loadFarms();
    } catch (err) {
        console.error("Error saving farm:", err);
    }
});

// Edit farm
async function editFarm(id) {
    try {
        const res = await fetch(`/api/farms/${id}`);
        const farm = await res.json();

        document.getElementById("farm_name").value = farm.farm_name;
        document.getElementById("crop_type").value = farm.crop_type;
        document.getElementById("region").value = farm.region;
        document.getElementById("responsible_technician").value = farm.responsible_technician;

        editingfarmId = id;
    } catch (err) {
        console.error("Error fetching farm:", err);
    }
}

// Delete farm
async function deleteFarm(id) {
    if (confirm("Do you want to delete this farm?")) {
        try {
            await fetch(`/api/farms/${id}`, { method: "DELETE" });
            loadFarms();
        } catch (err) {
            console.error("Error deleting farm:", err);
        }
    }
}

// Load farms on startup
loadFarms();
