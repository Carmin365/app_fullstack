import React, { useState } from 'react';
import './estilo.css'; 

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateForm = () => {
        let isValid = true;
        if (!name.trim()) {
            setNameError('Nome é obrigatório.');
            isValid = false;
        } else {
            setNameError('');
        }
        if (!email.trim()) {
            setEmailError('E-mail é obrigatório.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('E-mail inválido.');
            isValid = false;
        } else {
            setEmailError('');
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const res = await fetch('http://localhost:3001/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Erro ao enviar:', errorData);
                throw new Error(`Erro ao enviar: ${errorData?.message || 'Detalhes não fornecidos'}`);
            }

            const data = await res.json();
            console.log('Enviado com sucesso:', data);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Erro ao enviar o formulário');
        }
    };

    return (
        <div className="container">
            <h1>Formulário de Cadastro</h1>
            {submitted ? (
                <p>Cadastro realizado com sucesso!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {nameError && <p className="error">{nameError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="error">{emailError}</p>}
                    </div>
                    <button type="submit">Cadastrar</button>
                </form>
            )}
        </div>
    );
}

export default App;
    
