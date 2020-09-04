import React, { useState } from 'react';

export function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Counter</h1>
            <p>This is a simple example of a React hooks component.</p>
            <button className="btn btn-primary" onClick={() => setCount(count + 1)} >
                Кнопка нажата {count} раз!
            </button>
        </div>
        );
}