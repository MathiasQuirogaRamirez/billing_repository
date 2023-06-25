/*********************
GLOBAL VARIABLES     *            
**********************/
let myCompany;
let last_list_customers;
//container customer HTML
let container_customer;
let container_customer_list;
//container invoices HTML
let container_invoices;
let container_invoices_list;

/*********************
CLASES               *            
**********************/

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

    addCustomer(customer) {  
        if (this.customers === null) {
            this.customers = [];
        }                    
        this.customers.push(customer);
        console.log(this.customers.toString());
    }

    deleteCustomer(customer) {
        this.customers.remove(customer);
        console.log(this.customers.toString());
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

    toString () { 
        return ("Company\nDocumento: " + this.id + "\nNombre: " + this.name + "\n" + this.customers.toString() + "\n");
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

/*********************
FUNCTIONS            *            
**********************/

/***************************************************************
LOGIN
****************************************************************/
const singInResponse = (id, password) => {
    let companies = localStorage.getItem("companies");
    if (companies) {
        companies = JSON.parse (companies);
        const found = companies.find((i) => i.id === id);
        if (found && (found.password === password)) {
            const company = new Company();
            company.id = found.id;
            company.name = found.name;
            company.telephone = found.telephone;
            company.email = found.email;
            company.password = found.password;
            company.freelance = found.freelance;
            company.customers = get_customers(company.id);
            company.invoices = found.invoices;
            return company;
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
        myCompany = singInResponse (id, password);

        if (myCompany) {
            const page = document.createElement("div");
            page.className="custom_container";
            page.innerHTML = `
            <h1 class="display-4">${myCompany.name}</h1>
            <div class="line"></div>
            <h3 class="font-weight-light">${myCompany.id.toUpperCase()}</h3>

            <!-- Horizontal nav tab -->
            <ul class="nav nav-tabs container" id="myTab" role="tablist">
                <li class="nav-item">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#invoice_panel" role="tab" aria-controls="home" aria-selected="true">Invoices</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#customer_panel" role="tab" aria-controls="profile" aria-selected="false">Customers</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="invoice_panel" role="tabpanel" aria-labelledby="home-tab">
                    <div id="container_invoices" class="container">
                        <div id="container_invoices_list"></div>
                    </div>
                </div>
                <div class="tab-pane fade" id="customer_panel" role="tabpanel" aria-labelledby="profile-tab">
                    <div id="container_customers" class="container">
                        <div id="container_customers_list"></div>
                    </div>
                </div>
            </div>
            `;
            container.removeChild(login_registre);
            container.append(page);

            //container customer HTML
            container_customer = document.getElementById("container_customers");
            container_customer_list = document.getElementById("container_customers_list");
            //container invoices HTML
            container_invoices = document.getElementById("container_invoices");
            container_invoices_list = document.getElementById("container_invoices_list");

            //customers
            container_customer.append(header_customer);
            container_customer.append(container_customer_list);
            //print customer list in HTML
            print_customers(myCompany.customers, 'null');
            let btn_new_customer = document.getElementById("btn_new_customer");
            let btn_list_customer = document.getElementById("btn_list_customer");
            
            btn_new_customer.addEventListener("click", () => {
                container_customer.removeChild(container_customer_list);
                createCustomer();
                container_customer.append(container_customer_list);
            });
            
            btn_list_customer.addEventListener("click", () => {
                if (btn_list_customer.getAttribute('src') === 'assets/chevron_up.png') {
                  btn_list_customer.src="assets/chevron.png";
                  container_customer.removeChild(container_customer_list);
                } else {
                    btn_list_customer.src="assets/chevron_up.png";
                    container_customer.append(container_customer_list);
                }
            });

            //invoices
            container_invoices.append(header_invoice);
            container_invoices.append(container_invoices_list);

        } else
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
CREATE CUSTOMER
****************************************************************/
function createCustomer () {
    container_customer.append(new_customer);
    let btn_save_customer = document.getElementById("button_add_customer");
    let btn_cancel_customer = document.getElementById("button_cancel_customer");

    btn_save_customer.addEventListener("click", () => {
        let customer = new Customer (document.getElementById("customer_id").value, document.getElementById("customer_name").value,
        document.getElementById("customer_adress").value);
        myCompany.addCustomer(customer);
        print_customers('null', customer);
        reloadCompany();
        container_customer.removeChild(new_customer);
    });

    btn_cancel_customer.addEventListener("click", () => {
        container_customer.removeChild(new_customer);
    });
}

/***************************************************************
SAVE LIST CUSTOMERS IN STORAGE
****************************************************************/
const set_customers = (customers) => {
    localStorage.setItem(`${myCompany.id}_customers`, JSON.stringify(customers));
};

/***************************************************************
GET LIST CUSTOMERS FROM STORAGE
****************************************************************/
const get_customers = (id) => {
    let customers = localStorage.getItem(`${id}_customers`);
    customers = JSON.parse (customers);
    return customers;
};

/***************************************************************
CUSTOMER ADD / CUSTOMER LIST (HTML)
****************************************************************/
const print_customers = (customers, customer) => {

    if(customer === 'null') {
        console.log("entra null (lista)");
        if(customers !== null) {
            customers.forEach(item => {
                const list = document.createElement("div");
                list.className = "row border-bottom border-primary";
                list.innerHTML = `
                <img src="assets/customer.png" alt="customer icon">
                
                <div class="col-md-5 d-flex align-items-center">
                    <div>
                        <h6>${item.name}</h6>
                        <h6>${item.id}</h6>
                    </div>
                </div>
                <div class="col-md-5 d-flex align-items-center">
                    <h6>${item.adress}</h6>
                </div>
                <div class="d-flex align-items-center">
                    <img id="${item.id}" src="assets/delete.png" height="32" alt="delete icon">
                </div>
                `;
                container_customer_list.append(list);
                console.log(item.id);
                let btn_delete = document.getElementById(item.id);
                btn_delete.addEventListener("click", () => {
                    container_customer_list.removeChild(list);
                    let  customers_copy = myCompany.customers;
                    const found = customers_copy.find((i) => i.id === item.id);
                    customers_copy = customers_copy.splice(customers_copy.indexOf(found), 1);
                    set_customers(customers);
                });
            });
        }
    } else {
        console.log("entra add");
        const list = document.createElement("div");
        list.className = "row border-bottom border-primary";
        list.innerHTML = `
        <img src="assets/customer.png" alt="customer icon">
        
        <div class="col-md-5 d-flex align-items-center">
            <div>
                <h6>${customer.name}</h6>
                <h6>${customer.id}</h6>
            </div>
        </div>
        <div class="col-md-5 d-flex align-items-center">
            <h6>${customer.adress}</h6>
        </div>
        <div class="d-flex align-items-center">
            <img id="${customer.id}" src="assets/delete.png" height="32" alt="delete icon">
        </div>
        `;
        container_customer_list.append(list);
        console.log(customer.id);
        let btn_delete = document.getElementById(customer.id);
            btn_delete.addEventListener("click", () => {
                container_customer_list.removeChild(list);
                let customers_copy = myCompany.customers;
                const found = customers_copy.find((i) => i.id === customer.id);
                customers_copy = customers_copy.splice(customers_copy.indexOf(found), 1);
                set_customers(customers_copy);
        });
    }
};

/***************************************************************
INVOICE ADD / INVOICE LIST (HTML)
****************************************************************/
const print_invoices = (invoices, invoice) => {

    if(invoices === 'null') {
        console.log("entra null (lista)");
        if(invoices !== null) {
            invoices.forEach(item => {
                const list = document.createElement("div");
                list.className = "row border-bottom border-primary";
                list.innerHTML = `
                <img src="assets/invoice.png" alt="invoice icon">
                
                <div class="col-md-5 d-flex align-items-center">
                    <div>
                        <h6>${item.id}</h6>
                        <h6>${item.date}</h6>
                    </div>
                </div>
                <div class="col-md-5 d-flex align-items-center">
                    <h6>${item.customer.name}</h6>
                </div>
                <div class="d-flex align-items-center">
                    <img id="${item.id}" src="assets/delete.png" height="32" alt="delete icon">
                </div>
                `;
                container_invoices_list.append(list);
                console.log(item.id);
                let btn_delete = document.getElementById(item.id);
                btn_delete.addEventListener("click", () => {
                    container_invoices_list.removeChild(list);
                    let  invoices_copy = myCompany.invoices;
                    const found = invoices_copy.find((i) => i.id === item.id);
                    invoices_copy = invoices_copy.splice(invoices_copy.indexOf(found), 1);
                    //set_customers(customers);
                });
            });
        }
    } else {
        console.log("entra add");
        const list = document.createElement("div");
        list.className = "row border-bottom border-primary";
        list.innerHTML = `
        <img src="assets/customer.png" alt="customer icon">
        
        <div class="col-md-5 d-flex align-items-center">
            <div>
                <h6>${invoice.id}</h6>
                <h6>${invoice.date}</h6>
            </div>
        </div>
        <div class="col-md-5 d-flex align-items-center">
            <h6>${invoice.customer.name}</h6>
        </div>
        <div class="d-flex align-items-center">
            <img id="${invoice.id}" src="assets/delete.png" height="32" alt="delete icon">
        </div>
        `;
        container_invoices_list.append(list);
        console.log(invoice.id);
        let btn_delete = document.getElementById(invoice.id);
            btn_delete.addEventListener("click", () => {
                container_invoices_list.removeChild(list);
                let invoices_copy = myCompany.invoices;
                const found = invoices_copy.find((i) => i.id === invoice.id);
                invoices_copy = invoices_copy.splice(invoices_copy.indexOf(found), 1);
                //set_customers(customers_copy);
        });
    }
};

/***************************************************************
RELOAD COMPANY IN STORAGE
****************************************************************/
function reloadCompany() {
    let companies = localStorage.getItem("companies");
    if (companies) {
        companies = JSON.parse (companies);
        const found = companies.find((i) => i.id === myCompany.id);
        companies = companies.splice(companies.indexOf(found), 1);
    }
    else 
        companies = [];

    set_customers(myCompany.customers);
    companies.push(myCompany);   
    localStorage.setItem("companies", JSON.stringify(companies));
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
 ERROR COMPANY EXIST
****************************************************************/
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

/*********************
RUN PROGRAM          *            
**********************/

//container HTML
let container = document.getElementById("container");
/*//container customer HTML
container_customer = document.getElementById("container_customers");
container_customer_list = document.getElementById("container_customers_list");
//container invoices HTML
container_invoices = document.getElementById("container_invoices");
container_invoices_list = document.getElementById("container_invoices_list");*/

//login and registre HTML
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

//header customer
const header_customer = document.createElement("div");
header_customer.className = "row custom_container";
header_customer.innerHTML = `
<h3 class="font-weight-bold">Client list</h3>    
<img id="btn_list_customer" class="margin_icon" src="assets/chevron_up.png" height="32" alt="down icon">
<img id="btn_new_customer" class="margin_icon" src="assets/add.png" height="32" alt="more icon">
`;

//header invoice
const header_invoice = document.createElement("div");
header_invoice.className = "row custom_container";
header_invoice.innerHTML = `
<h3 class="font-weight-bold">Bill list</h3>    
<img id="btn_list_invoice" class="margin_icon" src="assets/chevron_up.png" height="32" alt="down icon">
<img id="btn_new_invoice" class="margin_icon" src="assets/add.png" height="32" alt="more icon">
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
//localStorage.clear();