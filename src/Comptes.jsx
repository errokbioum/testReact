import React, { useState, useEffect } from "react";
import { fetchBankAccounts, updateBankAccount, createCompte, deleteBankAccount } from "./api";
import { Button, Form, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Comptes() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateAccount, setUpdateAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    dateCreation: "",
    solde: "",
    type: "Courant",
  });
  const [isCreateOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBankAccounts();
      setAccounts(data);
    } catch (err) {
      setError("Failed to fetch bank accounts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBankAccount(id);
      fetchAccounts();
    } catch (err) {
      setError("Failed to delete the account. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { id, ...accountData } = updateAccount;
      accountData.dateCreation = formatDateString(accountData.dateCreation);

      await updateBankAccount(id, accountData);
      setUpdateAccount(null);
      fetchAccounts();
    } catch (err) {
      setError("Failed to update the account. Please try again.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      newAccount.dateCreation = formatDateString(newAccount.dateCreation);
      await createCompte(newAccount);
      resetNewAccount();
      setCreateOpen(false);
      fetchAccounts();
    } catch (err) {
      setError("Failed to create the account. Please try again.");
    }
  };

  const formatDateString = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
  };

  const resetNewAccount = () => {
    setNewAccount({ dateCreation: "", solde: "", type: "Courant" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const formatSolde = (solde) => {
    return solde ? solde.toFixed(2) : "0.00";
  };

  return (
    <div className="container my-4">
      <header className="mb-4">
        <h1>Comptes Bancaires</h1>
        <p className="text-muted">Liste de tous vos comptes bancaires</p>
        <Button
          onClick={() => setCreateOpen(true)}
          variant="primary"
        >
          Ajouter un Compte
        </Button>
      </header>

      <Modal show={isCreateOpen} onHide={() => setCreateOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Nouveau Compte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group controlId="dateCreation">
              <Form.Label>Date de création</Form.Label>
              <Form.Control
                type="date"
                value={newAccount.dateCreation}
                onChange={(e) => setNewAccount({ ...newAccount, dateCreation: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="solde">
              <Form.Label>Solde</Form.Label>
              <Form.Control
                type="number"
                value={newAccount.solde || ""}
                onChange={(e) => setNewAccount({ ...newAccount, solde: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={newAccount.type}
                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
              >
                <option value="Courant">Courant</option>
                <option value="Epargne">Epargne</option>
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="success">
              Créer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {updateAccount && (
        <Modal show={updateAccount !== null} onHide={() => setUpdateAccount(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier le Compte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="dateCreation">
                <Form.Label>Date de création</Form.Label>
                <Form.Control
                  type="date"
                  value={updateAccount.dateCreation || ""}
                  onChange={(e) => setUpdateAccount({ ...updateAccount, dateCreation: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="solde">
                <Form.Label>Solde</Form.Label>
                <Form.Control
                  type="number"
                  value={updateAccount.solde.toFixed(2) || ""}
                  onChange={(e) => setUpdateAccount({ ...updateAccount, solde: parseFloat(e.target.value) })}
                />
              </Form.Group>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  value={updateAccount.type || ""}
                  onChange={(e) => setUpdateAccount({ ...updateAccount, type: e.target.value })}
                >
                  <option value="Courant">Courant</option>
                  <option value="Epargne">Epargne</option>
                </Form.Control>
              </Form.Group>
              <Button type="submit" variant="warning" className="mr-2">
                Mettre à jour
              </Button>
              <Button
                variant="secondary"
                onClick={() => setUpdateAccount(null)}
              >
                Annuler
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date de Création</th>
              <th>Solde</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{formatDate(account.dateCreation)}</td>
                <td>{formatSolde(account.solde)}</td>
                <td>{account.type}</td>
                <td>
                  <Button
                    onClick={() => setUpdateAccount(account)}
                    variant="warning"
                    className="mr-2"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(account.id)}
                    variant="danger"
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}