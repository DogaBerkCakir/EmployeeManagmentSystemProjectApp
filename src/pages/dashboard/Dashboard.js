import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/employee");

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                setError(error.message); // Hata mesajını state'e kaydet
                console.log("Error fetching employees:", error.message);
            }
        }
        fetchEmployees();
    }, []);

    const handleDelete = async (employeeid) => {
        try {
            const responce = await fetch(`http://localhost:8080/api/employee/${employeeid}`, {
                method: "DELETE",
            });
            if (responce.ok) {
                setEmployees((prevEmployess) =>
                    prevEmployess.filter((employee => employee.id !== employeeid)
                    ))
            }
            console.log(`Employee with ID ${employeeid} deleted successfully`);

        } catch (error) {
            console.log("Error deleting employee ", error.message);
        }
    }

    const handleUpdate = (employeeid) => {
        navigate(`/employee/${employeeid}`);
    }


    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1 className="text-center">Employee</h1>
                    {error && <p className="text-danger">Error: {error}</p>} {/* Hata mesajını göster */}
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.department}</td>
                                    <td>
                                        <Button variant="outline-secondary" style={{ marginRight: '10px' }} onClick={() => handleUpdate(employee.id)}>Update</Button>
                                        <Button variant="outline-danger" onClick={() => handleDelete(employee.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;
