import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  // Los estados no deben estar dentro de llaves, si no dentro de paréntesis rectos, solo el store va en llaves
  const [ todos, setTodos ] = useState([]);
  const [ user, setUser ] = useState("");

  useEffect(() => {
    const cargaDeDatos = async () => {
      let { respuestaJson, response } = await actions.useFetch(
        `/todos/user/${user}`
      );
      if (response.ok) {
        setTodos(respuestaJson);
      }
    };
    cargaDeDatos();
  }, [user]);

  useEffect(() => {}, [todos]);

  const eliminar = async (i) => {
    let arrTemp = todos.filter((item, index) => {
      return index != i;
    });
    let { respuestaJson, response } = await actions.useFetch(
      `/todos/user/${user}`,
      arrTemp,
      "PUT"
    );

    if (response.ok) {
      setTodos(arrTemp);
    } else {
      alert("No se actualizó la API");
    }
  };

  return (
    <div className="container justify-content-center align-items-center  w-50  mt-4 ">
      <h1 className="titulo row d-flex justify-content-center mb-4 text-danger text-opacity-25 display-1">
        {" "}
        to do list{" "}
      </h1>
      <br />
      <div className="row d-flex justify-content-center my-4 shadow-lg p-3 mb-5">
        <input
          className="form-control form-control-lg rounded-0 text-secondary"
          placeholder="Username"
          // Pasamos el valor del input para el usuario y cambiamos el evento a onKeyDown
          // ya que si lo hacemos con onChange, te hará un fetch cada vez que presiones una tecla dentro del input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setUser(e.target.value);
            }
          }}
        ></input>
        <br />
        <input
          ype="text"
          className="form-control form-control-lg rounded-0 text-secondary"
          name="search"
          placeholder="What needs to be done?"
          // Seteamos el valor del input y agregamos una nueva tarea a nuestra lista de tareas
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.persist()
              setTodos(current => [...current, {label: e.target.value, done: false}]);
            }
          }}
        ></input>
        {todos && todos.length > 0 ? (
          <ul>
            {todos.map((item, index) => {
              return (
                <li key={index}>
                  {item.label}
                  <button
                    className="ocultar"
                    type="button"
                    onClick={() => {
                      eliminar(index);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <>No hay tareas por hacer</>
        )}
      </div>
    </div>
  );
};
