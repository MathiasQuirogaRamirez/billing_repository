/*********************GLOBAL VARIABLES*************************/
let myCompany;

/*****************************CLASS****************************/

/***************************************************************
COMPANY CLASS
****************************************************************/
class Company {

    customers = [];
    invoices = [];

    constructor (id, name, telephone, email, freelance, password) {
        this.id = id;
        this.name = name;
        this.telephone = telephone;
        this.email = email;
        this.freelance = freelance; 
        this.password = password;
    }

    addCustomer (customer) {                      
        this.customers.push(customer);
    }

    createInvoice () {
        const invoice = new Invoice (prompt ("Numero de factura: "), prompt ("Fecha: "), this.createCustomer ());
        this.invoices.push (invoice);
        this.setItems (invoice);
    }

    //Items array for invoice
    setItems (invoice) {
        const items = [];
        let opcion = 1;
    
        while (opcion !== 2) {
           opcion = parseInt (prompt ("* FACTURA *\n1)Añadir item\n2)Salir"));
            
            switch (opcion) {
                case 1:
                    items.push (this.getItem ());
                    break;
                case 2:
                   opcion = 2; 
                   if (items.length === 0) {
                        alert ("La factura debe tener al menos un item"); 
                        opcion = "";
                    }
                    break;
                default:
                    alert ("Opcion incorrecta, intentelo de nuevo");
                    break;
            }
        }

        const found = this.invoices.find((i) => i.id === invoice.id);
        if (found) {
            found.setItems (items);
            found.base = items.reduce((acum, item) => acum + item.base_total, 0);
            found.iva = items.reduce((acum, item) => acum + item.iva_total, 0);
            found.total = items.reduce((acum, item) => acum + item.total, 0);
        }
        else
            alert ("!Ups! Ha ocurrido un error");
    }

    //Create item invoice
    getItem () {
        const item = new Item (prompt ("Nombre: "), prompt ("Descripcion: "), parseInt (prompt ("Cantidad: ")),
        parseFloat (prompt ("Base inponible: ")), parseInt (prompt ("IVA: ")))
        return item;
    }

    searchInvoice () {
        let id = prompt ("Numero de factura: ");
        const found = this.invoices.find((i) => i.id === id);
        if (found)
            alert (found.toString ());
        else
            alert ("La factura con numero: " + id + " no existe");
    }
}

/***************************************************************
CUSTOMER CLASS
****************************************************************/
class Customer {
    constructor (id, name, adress) {
        this.id = id;
        this.name = name;
        this.adress = adress;
    }

    toString () { 
        return ("Cliente\nDocumento: " + this.id + "\nNombre: " + this.name + "\nDireccion: " +
                this.adress);
    }
}

/***************************************************************
INVOICE CLASS
****************************************************************/
class Invoice {

    constructor (id, date, customer) {
        this.id = id;
        this.date = date;
        this.customer = customer;
        this.base = 0;
        this.iva = 0;
        this.total = 0;
        const items = [];
    }

    setItems (items) {
        this.items = items;
    }

    toString () { 
        return ("* Factura *\nFecha: " + this.date + "\nNumero factura: " + this.id + "\n\n" +
        this.customer.toString () + "\n\n" + this.items.toString () + 
        "Base imponible: " + this.base + "    IVA: " + this.iva + "    Total = " + this.total + "\n\n");
    }
}

/***************************************************************
ITEM INVOICE CLASS
****************************************************************/
class Item {
    constructor (name, description, quantity, base, iva) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.base = base;
        this.iva = iva;
        this.base_total = base * quantity;
        this.iva_total = this.base * ( iva / 100 );
        this.total = this.base_total + this.iva_total;
    }

    toString () { 
        return (this.name + "\nDescripcion: " + this.description +
        "\nCantidad: " + this.quantity + "    Base: " + this.base + "    IVA: " + this.iva + 
        "\nBase = " + this.base_total + "    IVA = " + this.iva_total + "    Total = " + this.total + "\n\n");
    }
}

/***************************************************************
LOGIN
****************************************************************/
const singInResponse = (id, password) => {
    let companies = localStorage.getItem("companies");
    if (companies) {
        companies = JSON.parse (companies);
        const found = companies.find((i) => i.id === id);
        if (found && (found.password === password)) {
            console.log (found.name);
            return found;
        }
    }
    return false;
};

function singIn () {
    //data from login form
    let login_form = document.getElementById("form_login");
    login_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("form_login_document").value;
        const password = document.getElementById("form_login_password").value;

        if (myCompany = singInResponse (id, password)) {
            const page = document.createElement("div");
            page.className="custom_container";
            page.innerHTML = `
            <h1 class="display-4">${myCompany.name}</h1>
            <div class="line"></div>
            <h3 class="font-weight-light">${myCompany.id.toUpperCase()}</h3>
            `;
            container.removeChild(login_registre);
            container.append(page);

            //Customer
            container_customer.append(header_customer);
            let btn_new_customer = document.getElementById("btn_new_customer");
            
            btn_new_customer.addEventListener("click", () => {

                console.log(myCompany.name.toString());

                container_customer.append(new_customer);
                let btn_save_customer = document.getElementById("button_add_customer");
                let btn_cancel_customer = document.getElementById("button_cancel_customer");

                btn_save_customer.addEventListener("click", () => {
                    let customer = new Customer (document.getElementById("customer_id").value, document.getElementById("customer_name").value,
                    document.getElementById("customer_adress").value);

                    console.log(myCompany.id.toString());
                    myCompany.addCustomer (customer);
                    container_customer.removeChild(new_customer);
                });
                /*
                btn_cancel_customer.addEventListener("click", () => {
                    container_customer.removeChild(new_customer);
                });
                */
            });
        } 
        else
            alert ("Incorrect document or password");
    });
}

/***************************************************************
CREATE COMPANY
****************************************************************/
function createCompany () {
    //data from registre form
    let formuario = document.getElementById("form_registre");
    formuario.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("form_registre_document").value;
      const name = document.getElementById("form_registre_name").value;
      const email = document.getElementById("form_registre_email").value;
      const password = document.getElementById("form_registre_password").value;
      const password_ = document.getElementById("form_registre_password_").value;
      const telephone = document.getElementById("form_registre_tel").value;
      const freelance = document.getElementById("rbtn_yes").checked;
   
    const newCompany = new Company (id, name, telephone, email, freelance, password); 

    const error = errorCompany (newCompany, password_);
    if (error === "") {
        //save in local storage
        let companies = localStorage.getItem("companies");
        if (companies) 
            companies = JSON.parse (companies);
        else 
            companies = [];
        companies.push (newCompany);
        localStorage.setItem("companies", JSON.stringify(companies));
        alert ("Company saved");
    }
    else
        //error
        alert (error);     
    });      
}

/***************************************************************
ERROR COMPANY
****************************************************************/
function errorCompany (company, password_2) {
    let error;
    if (companyExist (company.id))
        error = "Company already exist";
    else if (company.id === "")
        error = "Empty fields";
    else if (company.email === "")
        error = "Empty fields";
    else if (company.name === "")
        error = "Empty fields";
    else if (company.telephone === "")
        error = "Empty fields";
    else if (company.password !== password_2)
        error = "The passwords are not the same " + company.password + " - " + password_2;
    // freelance is not necesary comprove because is radio button
    else 
        error = "";
    return error;
}
 
/***************************************************************
COMPANY EXIST
****************************************************************/
// Comprove if company exist in local storage
function companyExist (id) {
    let companies = localStorage.getItem("companies");
    if (companies) {
        companies = JSON.parse (companies);
        const found = companies.find((i) => i.id === id);
        if (found)
            return true;
    }
    return false;
}
/*******************************RUN*****************************/

//container HTML
let container = document.getElementById("container");
//container customer HTML
let container_customer = document.getElementById("container_customers");

//Login and registre HTML
const login_registre = document.createElement("div");
login_registre.className = "row justify-content-md-center";
login_registre.innerHTML = `
<div class="col-md-4 col_left">
<!-- Login -->
<form id="form_login">
    <div class="form-group">
    <input type="text" class="form-control" id="form_login_document" aria-describedby="emailHelp" placeholder="Nif or document">
    </div>
    <div class="form-group">
    <input type="password" class="form-control" id="form_login_password" placeholder="Password">
    </div>
    <!-- Button -->
    <button type="submit" class="btn btn-primary" id="button_login">Sing in</button>
</form>
</div>
<div class="col-md-4 border border-primary col_right">
<!-- Registre -->
<form id="form_registre">
    <div class="form-group">
    <input type="text" class="form-control" id="form_registre_document" aria-describedby="emailHelp" placeholder="Nif or document">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" id="form_registre_name" aria-describedby="emailHelp" placeholder="Social reason or full name">
    </div>
    <div class="form-group">
        <input type="email" class="form-control" id="form_registre_email" aria-describedby="emailHelp" placeholder="Enter email">
    </div>
    <div class="form-group">
    <input type="password" class="form-control" id="form_registre_password" placeholder="Password">
    </div>
    <div class="form-group">
        <input type="password" class="form-control" id="form_registre_password_" placeholder="Repeat password">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" id="form_registre_tel" aria-describedby="emailHelp" placeholder="Telephone">
    </div>
    <!-- Freelance question (radio buttons) -->
    <div class="form-group">
        <label>Are you freelance?</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="rbtn_yes" value="yes">
            <label class="form-check-label" for="inlineRadio1">Yes</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="rbtn_no" value="no">
            <label class="form-check-label" for="inlineRadio2">No</label>
        </div>
    </div>
    <!-- Button -->
    <button type="submit" class="btn btn-primary" id="button_registre">Create account</button>
</form>
</div>
`;
//header container customer
const header_customer = document.createElement("div");
header_customer.className = "row custom_container";
header_customer.innerHTML = `
<h3 class="font-weight-bold">Customers</h3>    
<img class="margin_icon" src="assets/chevron.png" height="32" alt="down icon">
<a href="#customer_new"><img id="btn_new_customer" class="margin_icon" src="assets/add.png" height="32" alt="more icon"></a>
`;
//create new customer
const new_customer = document.createElement("div");
new_customer.innerHTML = `
<!-- New customer -->
<div class="row">        
    <input type="text" class="form-control custom_container" id="customer_id" aria-describedby="emailHelp" placeholder="Document">
    <input type="text" class="form-control custom_container" id="customer_name" aria-describedby="emailHelp" placeholder="Name">
    <input type="text" class="form-control custom_container" id="customer_adress" aria-describedby="emailHelp" placeholder="Adress">
</div>
<!-- Button -->
<div class="d-flex flex-row-reverse">
    <button type="submit" class="btn btn-primary margin_icon" id="button_add_customer">Save</button>
    <button type="cancel" class="btn btn-outline-primary" id="button_cancel_customer">Cancel</button>
</div>
`;

//add to container (default)
container.append(login_registre);
document.getElementById("rbtn_yes").checked = true;

//buttons...
let btn_login = document.getElementById("button_login");
let btn_registre = document.getElementById("button_registre");

btn_login.addEventListener("click", singIn());
btn_registre.addEventListener("click", createCompany());