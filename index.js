require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

const API_KEY = process.env.API_KEY;
const CSE_ID = process.env.CSE_ID;

// Функция для поиска в Google
async function searchGoogle(query) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CSE_ID}`;
    console.log(`Запрос к URL: ${url}`); // Добавлена отладочная информация
    try {
        const response = await axios.get(url);
        console.log(`Ответ от Google: ${JSON.stringify(response.data, null, 2)}`); // Добавлена отладочная информация
        return response.data;
    } catch (error) {
        console.error('Ошибка при выполнении запроса к Google Custom Search API', error);
        return null;
    }
}

// Функция для извлечения ответов из результатов поиска
function extractAnswer(searchResults) {
    if (searchResults && searchResults.items && searchResults.items.length > 0) {
        // Скомпонуйте все сниппеты в один контекст для ответа
        const context = searchResults.items.map(item => item.snippet).join(' ');
        return context;
    } else {
        return "Я не смог найти ответ на ваш вопрос.";
    }
}

// Основная функция для обработки вопроса
async function handleQuestion(question) {
    console.log(`Обработка вопроса: ${question}`); // Добавлена отладочная информация
    const searchResults = await searchGoogle(question);
    console.log(`Результаты поиска: ${JSON.stringify(searchResults, null, 2)}`); // Добавлена отладочная информация
    const answer = extractAnswer(searchResults);
    return answer;
}

// Функция для интерактивного ввода вопросов пользователем
function askQuestions() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Введите ваш вопрос: ', async (question) => {
        const answer = await handleQuestion(question);
        console.log("Ответ:", answer);
        rl.close();
    });
}

// Запуск интерактивного ввода
askQuestions();
