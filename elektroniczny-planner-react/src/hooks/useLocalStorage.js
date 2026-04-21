// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Custom Hook do zarządzania stanem w LocalStorage.
 * Zapewnia trwałość danych między sesjami przeglądarki.
 *
 * @param {string} key Klucz, pod którym dane będą przechowywane w LocalStorage.
 * @param {any} initialValue Początkowa wartość stanu, jeśli w LocalStorage nie ma danych pod danym kluczem.
 * @returns {[any, Function]} Tablica zawierająca aktualną wartość stanu i funkcję do jego aktualizacji.
 */
function useLocalStorage(key, initialValue) {
    // Użyj funkcji do inicjalizacji stanu, aby odczytać z localStorage tylko raz
    // Jest to tzw. "lazy initialization" - funkcja jest wywoływana tylko przy pierwszym renderowaniu.
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Pobieramy wartość z LocalStorage po kluczu
            const item = window.localStorage.getItem(key);
            // Jeśli istnieje, parsjemy JSON. W przeciwnym razie zwracamy wartość początkową.
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Jeśli wystąpi błąd (np. LocalStorage jest niedostępne lub dane są uszkodzone),
            // logujemy ostrzeżenie i zwracamy wartość początkową.
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Użyj useEffect do synchronizacji stanu z LocalStorage za każdym razem,
    // gdy 'key' lub 'storedValue' się zmienią.
    useEffect(() => {
        try {
            // Zapisujemy aktualną wartość stanu do LocalStorage.
            // Musimy ją przekonwertować na string JSON, ponieważ LocalStorage przechowuje tylko stringi.
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            // Jeśli wystąpi błąd podczas zapisu, logujemy ostrzeżenie.
            console.warn(`Error writing localStorage key "${key}":`, error);
        }
    }, [key, storedValue]); // Tablica zależności: efekt uruchomi się, gdy 'key' lub 'storedValue' się zmienią.

    // Zwracamy aktualną wartość stanu i funkcję do jego aktualizacji,
    // tak samo jak w przypadku standardowego useState.
    return [storedValue, setStoredValue];
}

export default useLocalStorage;