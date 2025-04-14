import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import CreateManufacturingModal from "./CrearFabricacion";

const API_FABRICACION = 'http://localhost:8000/api/fabricacion'

const API_PRODUCTS = 'http://localhost:8000/api/productos'

function Fabricacion(){
    const [manufacturing, setManufacturing] = useState([]);
    const [products, setProducts] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setPending(true);
                const [manufacturingResponse, productResponse] = await Promise.all([
                    axios.get(API_FABRICACION),
                    axios.get(API_PRODUCTS),
                ]);
                setManufacturing(manufacturingResponse.data);
                setProducts(productResponse.data);
                setPending(false);
            } catch (error) {
                console.error("Error al obtener los datos: ", error);
                setPending(false);
            }
        };
        loadData();
    }, []);

    const getProductName = (productId)  => {
        const product = products.find(p => p.id === productId);
        return product ? `${product.ProductName}` : 'Producto no encontrado'
    }

    const deleteManufacturing = async (id) => {
        try {
            await axios.delete(`${API_FABRICACION}/${id}`);
            setManufacturing(manufacturing.filter(manufacturings => manufacturings.id !== id));
        } catch (error) {
            console.error("Error al eliminar la order de compra ", error);
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#343a40', 
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                minHeight: '50px',
                '&:nth-child(even)': {
                    backgroundColor: '#f8f9fa',
                },
                '&:hover': {
                    backgroundColor: '#e9ecef !important',
                },
            },
        },
        pagination: {
            style: {
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #dee2e6',
            },
        },
    };
    

    const columnas = [
        {
            name: 'Numero de Fabricacion',
            selector: row => row.id,
            sortabe: true,
        },
        {
            name: 'Producto',
            selector: row => `${row.ID_product} - ${getProductName(row.ID_product)}`,
            sortabe: true,
        },
        {
            name: 'Tiempo de Fabricacion',
            selector: row => row.ManufacturingTime,
            sortabe: true,
        },
        {
            name: 'Mano de Obra',
            selector: row => row.Labour,
            sortable: true
        },
        {
            name:'Masa en Gramos',
            selector: row => row.ManufactureProductG,
            sortabe:true,
        },
        {
            name: 'Costo de Producccion',
            selector: row => row.TotalCostProduction,
            sortabe:true
        },
        {
            name:'Acciones',
            cell: row => (
                <div className="btn-group" role="group">
                    <button
                        onClick={() => deleteManufacturing(row.id)}
                        className="btn btn-danger btn-sm"
                    >
                        Eliminar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    const paginationOptions = {
        rowsPerPageText: 'Registros por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
        noRowsPerPage: false,
    };

    return(
        <div className='container mt-4'>
            <div className='card'>
                <div className='card-header bg-primary text-white'>
                    <h1 className='h4'>Gestión de Recetas</h1>
                </div>

                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button 
                            onClick={() => setMostrarModal(true)} 
                            className='btn btn-success'
                        >
                            <i className="bi bi-plus-circle"></i> Crear Fabricacion
                        </button>
                    </div>

                    <DataTable
                        title="Lista de Pedidos"
                        columns={columnas}
                        data={manufacturing}
                        pagination
                        paginationPerPage={5} 
                        paginationRowsPerPageOptions={[5, 10, 15, 20]} 
                        paginationComponentOptions={paginationOptions}
                        highlightOnHover
                        pointerOnHover
                        responsive
                        striped
                        customStyles={customStyles}
                        progressPending={pending}
                        progressComponent={<div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>}
                        noDataComponent={<div className="alert alert-info">No hay Pedios registrados</div>}
                    />
                </div>
            </div>
            
            {mostrarModal && (
                <CreateManufacturingModal
                    onClose={() => setMostrarModal(false)}
                    onManufacturingCreated={() => {
                        const loadData = async () => {
                            try {
                                setPending(true);
                                const [manufacturingResponse, productResponse] = await Promise.all([
                                    axios.get(API_COMPRAS),
                                    axios.get(API_PROVEEDORES)
                                ]);
                                setManufacturing(manufacturingResponse.data);
                                setProducts(productResponse.data);
                                setPending(false);
                            } catch (error) {
                                console.error('Error al obtener datos:', error);
                                setPending(false);
                            }
                        };
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
export default Fabricacion;