# pr7part2

# Shopping Cart Refactoring Project

Це рішення Практичної роботи 7 (Частина 2). 

Проведено повний цикл рефакторингу legacy-модуля `CartService` із застосуванням патернів `Extract Class` та дотриманням принципів SOLID.

### Як перевірити роботу
1. Встановіть залежності: `npm install jest --save-dev`
2. Запустіть characterization-тести (перевірка старого коду): `npx jest tests/characterization/`
3. Запустіть unit-тести (перевірка нової поведінки та edge-cases): `npx jest tests/unit/`

### Основні досягнення
- Знищено God Object. Бізнес-логіка рознесена по окремих файлах: `DiscountCalculator`, `ShippingCalculator`, `CartValidator`.
- Додано захист від невалідного JSON у сховищі (усунуто краш додатку).
- Додано валідацію на кількість товару `<= 0`.
- Всі операції збереження та розрахунку переведено на Promise/Async підхід для легкої міграції на бекенд-базу даних у майбутньому.
