const datasets = [
  {
    id: "people",
    name: "People",
    description: "Small list of people with age and city.",
    rows: [
      { id: 1, name: "Ada", age: 28, city: "London" },
      { id: 2, name: "Grace", age: 35, city: "New York" },
      { id: 3, name: "Linus", age: 19, city: "Helsinki" },
      { id: 4, name: "Katherine", age: 22, city: "London" },
      { id: 5, name: "Margaret", age: 41, city: "Boston" },
    ],
  },
  {
    id: "orders",
    name: "Orders",
    description: "Orders linked to customers by customer_id.",
    rows: [
      { id: 101, customer_id: 1, total: 25.5, status: "paid" },
      { id: 102, customer_id: 2, total: 120.0, status: "paid" },
      { id: 103, customer_id: 3, total: 75.25, status: "refunded" },
      { id: 104, customer_id: 2, total: 15.0, status: "paid" },
      { id: 105, customer_id: 4, total: 250.0, status: "paid" },
    ],
  },
  {
    id: "products",
    name: "Products",
    description: "Basic product catalog.",
    rows: [
      { sku: "A100", name: "Keyboard", price: 49.99, category: "peripherals" },
      { sku: "A200", name: "Mouse", price: 19.99, category: "peripherals" },
      { sku: "B100", name: "Monitor", price: 179.0, category: "display" },
      { sku: "C100", name: "Laptop Stand", price: 39.0, category: "accessories" },
    ],
  },
];

export default datasets;
