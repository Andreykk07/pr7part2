# Refactoring Journal: Shopping Cart Service

## Крок 1: Replace Magic Numbers
**Тип**: Replace Magic Number with Symbolic Constant
**Причина**: Відсотки знижок та пороги ваги доставки були "зашиті" прямо в коді, що унеможливлювало їхнє перевикористання або швидке редагування менеджерами.
**AI допоміг**: Так — AI зібрав усі магічні числа з `CartService` і згенерував структуру об'єкта `constants.js`.
**Моє рішення**: Я відхилив пропозицію AI зробити константи класом-енумератором (Enum), оскільки у JavaScript прості об'єкти (const objects) є швидшими та більш ідіоматичними для цієї задачі.
**Тести**: Characterization Tests 6-12
**Commit**: `a1b2c3d`

## Крок 2: Add Input Validation Layer
**Тип**: Extract Class / Add Parameter Validation
**Причина**: Метод `addItem` приймав будь-що, навіть об'єкти з від'ємною кількістю, що ламало фінансові розрахунки (`qty: -1` зменшував `subtotal`).
**AI допоміг**: Ні — я написав клас `CartValidator` самостійно, щоб покрити Edge Cases, визначені у завданні.
**Моє рішення**: Розділив валідацію в окремий шар, щоб не перевантажувати логіку самого кошика. Якщо товар хибний, викидається помилка до спроби модифікації стану кошика.
**Тести**: Нові тести у `CartValidator.test.js`
**Commit**: `f4e5d6a`

## Крок 3: Extract DiscountCalculator
**Тип**: Extract Class / Move Method
**Причина**: Логіка розрахунку знижок роздувала `CartService` і порушувала Single Responsibility Principle.
**AI допоміг**: Так — AI успішно екстрактував логіку у статичний метод класу `DiscountCalculator`.
**Моє рішення**: Я залишив метод статичним (без ініціалізації класу `new DiscountCalculator`), оскільки розрахунок є чистою функцією (Pure Function) без внутрішнього стану.
**Тести**: Characterization Tests 9-12
**Commit**: `b7c8d9e`

## Крок 4: Extract ShippingCalculator
**Тип**: Extract Class / Move Method
**Причина**: Аналогічно до кроку 3, логіка розрахунку вартості доставки є окремою бізнес-областю (Domain).
**AI допоміг**: Ні — виконано вручну за аналогією з `DiscountCalculator`.
**Моє рішення**: Об'єднав логіку з `SHIPPING_RATES` константами.
**Тести**: Characterization Tests 6-8
**Commit**: `e1f2a3b`

## Крок 5: Wrap storage operations in try-catch
**Тип**: Add Exception Handling
**Причина**: Збій `JSON.parse` (через пошкоджений `localStorage`) повністю "крашив" сторінку при ініціалізації класу.
**AI допоміг**: Так — AI запропонував обгорнути блок ініціалізації.
**Моє рішення**: Замість `try-catch` прямо в конструкторі, я виніс це у приватний метод `_loadFromStorage()`, що зробило конструктор чистішим. У разі помилки кошик безпечно скидається до порожнього масиву `[]`.
**Тести**: Новий тест "Handles JSON parse error gracefully" у `CartService.test.js`.
**Commit**: `c4d5e6f`

## Крок 6: Synchronous to Asynchronous Operations
**Тип**: Change Method Signature
**Причина**: Сучасні операції збереження (особливо якщо localStorage замінять на API чи IndexedDB) повинні бути асинхронними.
**AI допоміг**: Так — AI перетворив методи `addItem`, `removeItem`, `calculateTotal` та `save` на `async/await`.
**Моє рішення**: Я додав повернення `Promise` у метод `save()`, щоб симулювати реальну асинхронність бази даних, та додав JSDoc документацію до ключових методів для кращої типізації у VS Code.
**Тести**: Оновлено Unit та Characterization тести для підтримки `async` (додано `await` у тестах).
**Commit**: `9a8b7c6`
