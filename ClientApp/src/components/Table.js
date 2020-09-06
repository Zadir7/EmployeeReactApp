import React, { useState, useEffect, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default function Table() {
    const [table, setTable] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState('lastname');
    const [formValue, setFormValue] = useState("");
    const [viewModal, setviewModal] = useState(false);
    const [row, setRow] = useState(-1);
    const [data, setData] = useState({
        employees: [],
        positions: []
    });

        
    useMemo(() => {
        let pos = require('./Data/positions.json').map((item) => {
            return {
                id: item.id,
                position: item.caption
            };
        });
        let emp = require('./Data/employees.json').map((item, i) => {
            return {
                id: i,
                firstname: item.name,
                lastname: item.famile,
                age: item.age,
                position: pos[item.positioned].position
            };
        });
        setData({ employees: emp, positions: pos });
    },[]);

    const handleChange = e => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        let results = !searchTerm
            ? data.employees
            : data.employees.filter(key =>
            key.firstname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            key.lastname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            key.age.toString().includes(searchTerm.toLocaleLowerCase()) ||
            key.position.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        setTable(results);
    }, [data.employees, searchTerm]);

    useEffect(() => {
        let emp = data.employees;
        let pos = data.positions.map(item => item.position);
        let lname, fname, age, posit;
        if (row == -1) {
            lname = "";
            fname = "";
            age = "";
            posit = pos[0];
        } else {
            for (let i = 0; i < emp.length; i++) {
                if (row == emp[i].id) {
                    lname = emp[i].lastname;
                    fname = emp[i].firstname;
                    age = emp[i].age;
                    posit = emp[i].position;
                }
            }
        }
        setFormValue({
            lastname: lname,
            firstname: fname,
            age: age,
            position: posit
        });
    }, [viewModal]);

    useMemo(() => {
            table.sort((a, b) => {
                if (a[sortField.key] < b[sortField.key]) {
                    return sortField.direction === 'asc' ? -1 : 1;
                }
                if (a[sortField.key] > b[sortField.key]) {
                    return sortField.direction === 'asc' ? 1 : -1;
                }
                return 0;
            })
    }, [sortField.key, sortField.direction]);

    const RequestSort = key => {
        let direction = 'asc';
        if (sortField.key === key && sortField.direction === 'asc') {
            direction = 'desc';
        }
        setSortField({ key, direction });
    }

    const GetButtonValues = (name) => {
        return sortField.key === name ? sortField.direction : "X";
    }

    const closeModal = () => {
        setviewModal(false);
        setRow(-1);
    }

    function deleteRow(rowId) {
        for (let i = 0; i < data.employees.length; i++) {
            if (rowId == data.employees[i].id) {
                data.employees.splice(i, 1);
            }
        }
        setData({employees:data.employees, positions: data.positions})
    }

    const submitData = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let element =
        {
            id: (row == -1) ? data.employees.length : row,
            lastname: formData.get('lastname'),
            firstname: formData.get('firstname'),
            age: formData.get('age'),
            position: formData.get('position')
        };
        data.employees[element.id] = element;
        closeModal();
    }

    return (
        <div>
            <h1>Таблица сотрудников</h1>
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>
                            Фамилия
                            <input type="button" value={GetButtonValues('lastname')} onClick={() => RequestSort('lastname') }/>
                        </th>
                        <th>
                            Имя
                            <input type="button" value={GetButtonValues('firstname')} onClick={() => RequestSort('firstname')} />
                        </th>
                        <th>
                            Возраст
                            <input type="button" value={GetButtonValues('age')} onClick={() => RequestSort('age')} />
                        </th>
                        <th>
                            Должность
                            <input type="button" value={GetButtonValues('position')} onClick={() => RequestSort('position')} />
                        </th>
                        <th>
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {table.map(tab =>
                        <tr key={tab.id}>
                            <td>{tab.lastname}</td>
                            <td>{tab.firstname}</td>
                            <td>{tab.age}</td>
                            <td>{tab.position}</td>
                            <td>
                                <input type="button" value="Изменить" onClick={() => { setRow(tab.id); setviewModal(true); }} />
                            </td>
                            <td>
                                <input type="button" value="Удалить" onClick={() => deleteRow(tab.id)} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p>Поиск: 
                <input
                    type="text"
                    value={searchTerm}
                    className="searchInput"
                    onChange={handleChange}
                />
            </p>
            <Button variant="primary" type="button" onClick={() => { setRow(-1); setviewModal(true); }}>
                Добавить сотрудника
            </Button>
            <Modal show={viewModal} onHide={closeModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление/Изменение данных</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => submitData(e)}>
                        <Form.Group>
                            <Form.Label>
                                Фамилия
                        </Form.Label>
                            <Form.Control name="lastname" type="text" placeholder="Фамилия" value={formValue.lastname} onChange={(e) => setFormValue({ lastname: e.target.value } ) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Имя
                        </Form.Label>
                            <Form.Control name="firstname" type="text" placeholder="Имя" value={formValue.firstname} onChange={(e) => setFormValue({ firstname: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Возраст
                        </Form.Label>
                            <Form.Control name="age" type="text" placeholder="18" value={formValue.age} onChange={(e) => setFormValue({ age: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Должность
                        </Form.Label>
                            <Form.Control as="select" name="position" value={formValue.position} onChange={(e) => setFormValue({ position: e.target.value })}>
                                {data.positions.map(data =>
                                    <option key={data.id} value={data.position}>{data.position}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="secondary" type="button" onClick={closeModal}>
                            Закрыть
                    </Button>
                        <Button variant="primary" type="submit">
                            Сохранить
                    </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}