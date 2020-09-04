import React, { useState, useEffect, useMemo } from 'react';

export function Table() {
    const [table, setTable] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState('lastname');
    

    const handleChange = e => {
        setSearchTerm(e.target.value);
    }

    const getData = () => {
        const positions = require('./Data/positions.json').map(item => item.caption);
        const employees = require('./Data/employees.json').map((item, i) => {
            return {
                id: i,
                firstname: item.name,
                lastname: item.famile,
                age: item.age,
                position: positions[item.positioned]
            };
        })
        return employees;
    }

    useEffect(() => {
        let results = !searchTerm
            ? getData()
            : getData().filter(key =>
            key.firstname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            key.lastname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            key.age.toString().includes(searchTerm.toLocaleLowerCase()) ||
            key.position.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        setTable(results);
        
    }, [searchTerm]);

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
                            <td></td>
                            <td></td>
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
        </div>
    );
}