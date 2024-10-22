export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [

      { id: "podvapes", label: "Pod Vapes" },
      { id: "disposablevapes", label: "Disposable Vapes" },
      { id: "vapepens", label: "Vape Pens" },
      { id: "cigalikes", label: "Cigalikes" },
      { id: "vapemods", label: "Vape Mods" },
      
    ],
  },
  {
    label: "Flavor", 
    name: "flavor",
    componentType: "select",
    options: [
      { id: "vanilla", label: "Vanilla" },
      { id: "chocolate", label: "Chocolate" },
      { id: "strawberry", label: "Strawberry" },
      { id: "mint", label: "Mint" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
     
     
      { id: "airscream", label: "Airscream" },
      { id: "elfbar", label: "Elfbar" },
      { id: "nasty", label: "Nasty" },
      { id: "fume", label: "Fume" },
      { id: "dejavoo", label: "Dejavoo" },
      { id: "ijoy", label: "IJOY" },

    ],
  },

  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
 
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price ",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
 
  {
    id: "disposablevapes",
    label: "Disposable Vapes",
    path: "/shop/listing",
  },
  {
    id: "vapepens",
    label: "Vape Pens",
    path: "/shop/listing",
  },
  {
    id: "vapemods",
    label: "Vape Mods",
    path: "/shop/listing",
  },
  {
    id: "cigalikes",
    label: "Cigalikes",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
 
  disposablevapes: "Disposable Vapes",
  vapepens: "Vape Pens",
  vapemods: "Vape Mods",
  cigalikes: "Cigalikes",
};

export const brandOptionsMap = {
  airscream: "Airscream",
  elfbar: "elfbar",
  nasty: "Nasty",
  fume: "Fume",
  dejavoo: "Dejavoo",
  ijoy: "Ijoy",
};

export const filterOptions = {
  category: [
    
    { id: "disposablevapes", label: "Disposable Vapes" },
    { id: "vapepens", label: "Vape Pens" },
    { id: "vapemods", label: "Vape Mods" },
    { id: "cigalikes", label: "Cigalikes" },
  ],
  brand: [
    { id: "airscream", label: "Airscream" },
    { id: "elfbar", label: "Elfbar" },
    { id: "nasty", label: "Nasty" },
    { id: "fume", label: "Fume" },
    { id: "dejavoo", label: "Dejavoo" },
    { id: "ijoy", label: "Ijoy" },
  ],
};


export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "postcode",
    name: "postcode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your postcode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
