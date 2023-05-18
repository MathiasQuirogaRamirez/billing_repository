/*********************GLOBAL VARIABLES*************************/
let company = null

/*****************************CLASS****************************/

/***************************************************************
COMPANY CLASS
****************************************************************/
class Company {

    customers = [];
    invoices = [];

    constructor (id, name, telephone, email, freelance) {
        this.id = id;
        this.name = name;
        this.telephone = telephone;
        this.email = email;
        this.freelance = this.getFreelance (freelance); 
    }

    //Convert user response (String to Boolean)
    getFreelance (freelance) {
        if (freelance.toLowerCase() === "si")
            return true;
        return false;
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

/***************************************************************
CREATE COMPANY
****************************************************************/
function createCompany () {
    if (company === null) {
        const newCompany = new Company (prompt ("NIF o DNI: "), prompt ("Nombre completo o razon social: "), 
                                    prompt ("Telefono: "), prompt ("Correo: "), prompt ("¿Eres autonomo?")); 
        company = newCompany;         
    } else 
        alert ("Ya has creado la compañia");                       
}
 
/***************************************************************
COMPANY EXIST
****************************************************************/
// Comprove if company exist because all the data is save inside de Compañy
function companyExist () {
    if (company !== null)
        return true;     
    else 
        alert ("Primero debes crear la compañia");
    return false;
}
/*******************************RUN*****************************/
menu ();






