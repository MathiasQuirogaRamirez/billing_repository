/*********************GLOBAL VARIABLES*************************/
const items = [];

/*****************************CLASS****************************/

/***************************************************************
COMPANY CLASS
****************************************************************/
class Company {
    constructor (id, name, telephone, email, freelance) {
        this.id = id;
        this.name = name;
        this.telephone = telephone;
        this.email = email;
        this.freelance = freelance;
        const customers = [];
        const invoices = [];
    }

    createCustomer () {
        const customer = new Customer (prompt ("NIF o DNI: "), prompt ("Nombre completo o razon social: "),
                              prompt ("Direccion: "));
        customers.push (customer);
        return customer;
    }

    createInvoice (items) {
        const invoice = new Invoice (prompt ("Numero de factura: "), prompt ("Fecha: "), createCustomer ());
        invoice.setItems (items);
        invoices.push (invoice);
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
5) Añadir cliente
6) Salir 
*/

/*function menu () {
    
    let opcion = 1;

    while (opcion !== 6) {
       opcion = parseInt (prompt ("*** MENU ***\n\n1)Ingresar datos de la empresa\n2)Crear factura\n3)Mostrar factura\n4)Mostrar lista de facturas\n5)Salir"));
        
        switch (opcion) {
            case 1:
                
                break;
            case 2:
                
                break;
            case 3:
                
                break;
            case 4:
                
                break;
            case 5:
                
                break;
            case 6:
                opcion = 6;
                break;
            default:
                alert ("Opcion incorrecta, intentelo de nuevo");
                break;
        }
    }
}*/

/***************************************************************
CREATE COMPANY
****************************************************************/
function createCompany () {
    const company = new Company (prompt ("NIF o DNI: "), prompt ("Nombre completo o razon social: "), 
                                 prompt ("Telefono: "), prompt ("Correo: "), prompt ("Autonomo: ")); 
    return company;                                
}

/***************************************************************
ADD ITEM INVOICE
****************************************************************/
function addItem (name, description, quantity, base, iva) {
    items.push ({name: name, 
        description: description, 
        quantity: quantity, 
        base: base, 
        iva: iva,
        total: ( base * quantity ) * ( iva / 100 )
    });
}

/*******************************RUN*****************************/
//menu ();






