# VETOR Estudos — estrutura reorganizada

## Organização
- `index.html` — entrada da plataforma
- `pages/materias/<materia>/index.html` — página principal da matéria
- `pages/materias/<materia>/topico-1.html` ... `topico-6.html` — uma subpágina por tópico
- `assets/css/base.css` — sistema visual, responsividade, acessibilidade e componentes
- `assets/css/themes.css` — identidade de cor por matéria
- `assets/js/app.js` — menu mobile e carrosséis
- `assets/images/<materia>/` — ilustrações específicas de cada conteúdo

## Direção de design
A interface foi reorganizada com foco em hierarquia visual, movimento com propósito, estados de interação, acessibilidade, performance e experiência mobile. A base é compartilhada para manter consistência, mas cada matéria recebe cor, atmosfera, ilustrações e linguagem visual próprias.

## Carrosséis
Todas as matérias possuem carrossel de curiosidades. As imagens são locais em SVG, então o site não depende de um serviço externo de imagens para carregar a interface.
