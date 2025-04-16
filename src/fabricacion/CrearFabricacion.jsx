import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_MANUFACTURING = 'http://localhost:8000/api/fabricacion';
const API_PRODUCTS = 'http://localhost:8000/api/productos';
const API_INPUTS = 'http://localhost:8000/api/insumos';

function CreateManufacturingModal({ onClose, onManufacturingCreated }) {
    const [products, setProducts] = useState([]);
    const [inputs, setInputs] = useState([]);
    const [manufacturing, setManufacturing] = useState({
        ID_product: '',
        ManufacturingTime: '',
        recipes: []
    });

    const [newRecipe, setNewRecipe] = useState({
        ID_inputs: '',
        AmountSpent: '',
        UnitMeasurement: 'g'
    });

    const [selectedInput, setSelectedInput] = useState(null);
    const [loading, setLoading] = useState(true);
    const [backendCalculatedPrices, setBackendCalculatedPrices] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseProducts, responseInputs] = await Promise.all([
                    axios.get(API_PRODUCTS),
                    axios.get(API_INPUTS)
                ]);
                setProducts(responseProducts.data);
                setInputs(responseInputs.data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleManufacturingChange = (e) => {
        setManufacturing({ ...manufacturing, [e.target.name]: e.target.value });
    };

    const handleRecipeChange = (e) => {
        setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value });
    };

    const handleSelectInput = (e) => {
        const selectedId = e.target.value;
        const input = inputs.find(i => i.id === parseInt(selectedId));
        setSelectedInput(input);
        setNewRecipe({ ...newRecipe, ID_inputs: selectedId });
    };

    const addRecipe = () => {
        if (!newRecipe.ID_inputs || !newRecipe.AmountSpent) {
            alert("All input fields are required.");
            return;
        }

        const amountInGrams = newRecipe.UnitMeasurement === 'g' 
            ? parseFloat(newRecipe.AmountSpent)
            : (newRecipe.UnitMeasurement === 'Kg' 
                ? parseFloat(newRecipe.AmountSpent) * 1000
                : parseFloat(newRecipe.AmountSpent) * 453.592);

        const recipeToAdd = {
            ID_inputs: newRecipe.ID_inputs,
            AmountSpent: amountInGrams,
            UnitMeasurement: 'g',
            InputName: selectedInput?.InputName || ''
        };

        setManufacturing({
            ...manufacturing,
            recipes: [...manufacturing.recipes, recipeToAdd]
        });

        setNewRecipe({
            ID_inputs: '',
            AmountSpent: '',
            UnitMeasurement: 'g'
        });
        setSelectedInput(null);
    };

    const removeRecipe = (index) => {
        const updatedRecipes = [...manufacturing.recipes];
        updatedRecipes.splice(index, 1);
        setManufacturing({ ...manufacturing, recipes: updatedRecipes });
    };

    const submitManufacturing = async () => {
        if (!manufacturing.ID_product || !manufacturing.ManufacturingTime || manufacturing.recipes.length === 0) {
            alert("Missing required data or inputs.");
            return;
        }

        try {
            const response = await axios.post(API_MANUFACTURING, {
                ID_product: manufacturing.ID_product,
                ManufacturingTime: manufacturing.ManufacturingTime,
                recipes: manufacturing.recipes.map(recipe => ({
                    ID_inputs: recipe.ID_inputs,
                    AmountSpent: recipe.AmountSpent,
                    UnitMeasurement: recipe.UnitMeasurement
                }))
            });

            // Guardamos los precios calculados por el backend
            const calculatedPrices = {};
            response.data.Fabricacion.recipes.forEach(recipe => {
                calculatedPrices[recipe.ID_inputs] = recipe.PriceQuantitySpent;
            });
            setBackendCalculatedPrices(calculatedPrices);
            
            alert("Manufacturing created successfully");
            onManufacturingCreated?.(response.data.Fabricacion);
            onClose();
        } catch (error) {
            console.error("Error creating manufacturing:", error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="modal fade show d-flex align-items-center" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Create Manufacturing Order</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Product selection */}
                        <div className="mb-4">
                            <label htmlFor="ID_product" className="form-label">Product *</label>
                            <select 
                                className="form-select"
                                id="ID_product"
                                name="ID_product"
                                value={manufacturing.ID_product}
                                onChange={handleManufacturingChange}
                                required
                            >
                                <option value="">Select a product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.ProductName || product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="ManufacturingTime" className="form-label">Manufacturing Time (minutes) *</label>
                            <input 
                                type="number" 
                                className="form-control"
                                id="ManufacturingTime"
                                name="ManufacturingTime"
                                value={manufacturing.ManufacturingTime}
                                onChange={handleManufacturingChange}
                                min="1"
                                required
                            />
                        </div>

                        {/* Inputs section */}
                        <div className="card mb-4">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Añadir Insumo (Recipe)</h6>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <label htmlFor="ID_inputs" className="form-label">Insumo</label>
                                        <select 
                                            className="form-select"
                                            id="ID_inputs"
                                            value={newRecipe.ID_inputs}
                                            onChange={handleSelectInput}
                                        >
                                            <option value="">Seleccione el insumo</option>
                                            {inputs.map(input => (
                                                <option key={input.id} value={input.id}>
                                                    {input.InputName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="AmountSpent" className="form-label">Cantidad</label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            id="AmountSpent"
                                            name="AmountSpent"
                                            value={newRecipe.AmountSpent}
                                            onChange={handleRecipeChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label htmlFor="UnitMeasurement" className="form-label">Unidad</label>
                                        <select 
                                            className="form-select"
                                            id="UnitMeasurement"
                                            name="UnitMeasurement"
                                            value={newRecipe.UnitMeasurement}
                                            onChange={handleRecipeChange}
                                        >
                                            <option value="g">Grams (g)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button 
                                            onClick={addRecipe} 
                                            className="btn btn-primary w-100"
                                            disabled={!newRecipe.ID_inputs}
                                            title="Add input"
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Selected input information */}
                                {selectedInput && (
                                    <div className="alert alert-info mt-3 mb-0">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <strong>Input:</strong> {selectedInput.InputName}
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Current stock:</strong> {selectedInput.CurrentStock} g
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Unit Price:</strong> ${selectedInput.UnityPrice?.toFixed(2) || '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current recipe */}
                        <div className="card">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Current Recipe</h6>
                            </div>
                            <div className="card-body p-0">
                                {manufacturing.recipes.length === 0 ? (
                                    <div className="alert alert-warning m-3">No inputs added to the recipe</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Input</th>
                                                    <th>Amount (g)</th>
                                                    <th>Estimated Cost</th>
                                                    <th style={{ width: '50px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {manufacturing.recipes.map((item, index) => {
                                                    const input = inputs.find(i => i.id === parseInt(item.ID_inputs));
                                                    const calculatedPrice = backendCalculatedPrices[item.ID_inputs];
                                                    return (
                                                        <tr key={index}>
                                                            <td>{input?.InputName || `Input ID: ${item.ID_inputs}`}</td>
                                                            <td>{item.AmountSpent}</td>
                                                            <td>
                                                                <button 
                                                                    onClick={() => removeRecipe(index)}
                                                                    className="btn btn-danger btn-sm"
                                                                    title="Remove"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="table-light">
                                                <tr>
                                                    <td colSpan="2" className="text-end fw-bold">Total Estimated Cost:</td>
                                                    <td className="fw-bold">
                                                        {Object.values(backendCalculatedPrices).length > 0
                                                            ? `$${Object.values(backendCalculatedPrices).reduce((sum, price) => sum + price, 0).toFixed(2)}`
                                                            : 'N/A'}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={submitManufacturing}
                            disabled={manufacturing.recipes.length === 0 || !manufacturing.ID_product}
                        >
                            Save Manufacturing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateManufacturingModal;