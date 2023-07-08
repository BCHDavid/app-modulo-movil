export const getClient = async (email) => {
    const res = await fetch(`https://app-modulo-administrador-production.up.railway.app/clients/buscar_por_email`, {
        method: 'POST',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    return await res.json();
};
export const getDishes = async () => {
    const res = await fetch('https://app-modulo-administrador-production.up.railway.app/dishes', {
        headers: {
            Accept: 'application/json',
        },
    });
    const data = await res.json();
    return data;
};
export const getDish = async (id) => {
    const res = await fetch(`https://app-modulo-administrador-production.up.railway.app/dishes/${id}`, {
        headers: {
            Accept: 'application/json',
        },
    });
    const data = await res.json();
    return data;
};
export const saveClient = async (newClient) => {
    const res = await fetch(`https://app-modulo-administrador-production.up.railway.app/clients`, {
        method: 'POST',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(newClient)
    });
    return await res.json();
};
export const saveOrder = async (newOrder) => {
    const res = await fetch(`https://app-modulo-administrador-production.up.railway.app/orders`, {
        method: 'POST',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
    });
    return await res.json();
};
export const saveOrderxDishes = async (OrdenXDishes) => {
    const res = await fetch(`https://app-modulo-administrador-production.up.railway.app/dishxorders`, {
        method: 'POST',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(OrdenXDishes)
    });
    return await res.json();
};
export const updateClient = async (id, newClient) => {
    const res = await fetch(`https://app-modulo-administrador-production.up.railway.app/clients/${id}`, {
        method: 'PUT',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(newClient)
    });
    return await res.json();
};
