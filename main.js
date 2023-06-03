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

    createCustomer () {
        const customer = new Customer (prompt ("* Cliente *\nNIF o DNI: "), prompt ("* Cliente *\nNombre completo o razon social: "),
                              prompt ("* Cliente *\nDireccion: "));
                              
        this.customers.push(customer);
        return customer;
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

/**************************FUNCTIONS****************************/

/***************************************************************
MENU
****************************************************************/
/*
1) Ingresar datos de la empresa
2) Crear factura
3) Mostrar factura
4) Mostrar lista de facturas
5) Salir
*/

function menu () {
    
    let opcion = 1;

    while (opcion !== 5) {
       opcion = parseInt (prompt ("*** MENU ***\n\n1)Ingresar datos de la empresa\n2)Crear factura\n3)Mostrar factura\n4)Mostrar lista de facturas\n5)Salir"));
        
        switch (opcion) {
            case 1:
                createCompany ();
                break;
            case 2:
                company.createInvoice ();
                break;
            case 3:
                if (companyExist ())  
                    company.searchInvoice ();
                break;
            case 4:
                if (companyExist ())
                    if (company.invoices.length > 0)
                        alert (company.invoices.toString ());
                    else
                        alert ("No hay facturas");
                break;
            case 5:
                opcion = 5;
                break;
            default:
                alert ("Opcion incorrecta, intentelo de nuevo");
                break;
        }
    }
}
// New code ------> 

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
        let inputs = e.target.children;
        let id = inputs[3].value;
        let password = inputs[7].value;

        if (myCompany = singInResponse (id, password)) {
            alert ("Started session"); 
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
    let registre_form = document.getElementById("form_registre");
    registre_form.addEventListener("submit", (e) => {
        e.preventDefault();
        let inputs = e.target.children;
        //console.log (inputs[3].value);  //id
        //console.log (inputs[7].value);  //name
        //console.log (inputs[11].value); //email
        //console.log (inputs[15].value); //password 1
        //console.log (inputs[19].value); //pasword 2
        //console.log (inputs[23].value); //telephone
        //console.log (inputs[26].checked); //yes (freelance)
        //console.log (inputs[29].checked); //no (freelance)
        
        const newCompany = new Company (inputs[3].value, inputs[11].value, 
            inputs[27].value, inputs[15].value, inputs[26].checked, inputs[15].value); 

        const error = errorCompany (newCompany, inputs[19].value);
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
        error = "The passwords are not the same";
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

//HTML login
const login = document.createElement("div");
login.innerHTML = `
    <form action="#" method="get" enctype="application/x-www-form-urlencoded" id="form_login">
        <h3>Sing in</h3>
        <label for="form_log_id">NIF or DNI:</label><br>
        <input type="text" id="form_log_id" name="id"><br>
        <label for="form_log_password">Password:</label><br>
        <input type="password" id="form_log_password" name="password"><br>
        <br><input type="submit" value="Login">
    </form> 
`;

//HTML registre
const registre = document.createElement("div");
registre.innerHTML = `
    <form action="#" method="get" enctype="application/x-www-form-urlencoded" id="form_registre">
        <h3>Create account</h3>
        <label for="form_reg_id">NIF or DNI:</label><br>
        <input type="text" id="form_reg_id" name="id"><br>
        <label for="form_reg_name">Name or Social reason:</label><br>
        <input type="text" id="form_reg_name" name="name"><br>
        <label for="form_reg_email">Email:</label><br>
        <input type="email" id="form_reg_email" name="email"><br>
        <label for="form_reg_password">Password:</label><br>
        <input type="password" id="form_reg_password" name="password"><br>
        <label for="form_reg_password_repeat">Repeat password:</label><br>
        <input type="password" id="form_reg_password_repeat" name="password"><br>
        <label for="form_reg_tel">Telephone:</label><br>
        <input type="text" id="form_reg_tel" name="telephone"><br>
        <p>Are you freelance ?</p>
        <input type="radio" id="rbt_yes" name="fav_language" value="Yes">
        <label for="rbt_yes">Yes</label><br>
        <input type="radio" id="rbt_no" name="fav_language" value="No" checked="checked">
        <label for="rbt_no">No</label><br>
        <br><input type="submit" value="Registre">
    </form> 
`;

//add to container (default)
container.append(login);
container.append(registre);
registre.style.display = 'none';

//buttons...
let btn_login = document.getElementById("button_login");
let btn_registre = document.getElementById("button_registre");

let showLogin = () => {
    login.style.display = 'block'
    registre.style.display = 'none';
}

let showRegistre = () => {
    registre.style.display = 'block';
    login.style.display = 'none';
}

btn_login.addEventListener("click", showLogin);
btn_registre.addEventListener("click", showRegistre);

createCompany ();
singIn ();


