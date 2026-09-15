# VETOR Estudos

Plataforma estática de estudos para ensino médio, programação e autoria web.

## O que esta versão traz

- 12 matérias, cada uma com 6 tópicos dedicados.
- Identidade visual própria por matéria: editorial, comunicação, grid matemático, ondas, laboratório, orgânico, arquivo, cartografia, monumental, rede, terminal e browser.
- 6 curiosidades por matéria com ilustrações locais.
- Home redesenhada com botões diretos para cada matéria, busca, continuidade de estudo, curiosidade do dia, progresso e desafio leve.
- Progresso salvo em `localStorage`, sem servidor e sem envio de dados.
- Menu lateral no desktop e drawer sobreposto no celular.
- Microinterações com curvas e durações curtas, feedback de toque e suporte a `prefers-reduced-motion`.
- Estrutura sem dependências de framework: HTML + CSS + JavaScript.
- Ilustrações SVG locais para evitar dependência de imagens externas.

## Estrutura

```text
/
├── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   └── themes.css
│   ├── images/
│   └── js/
│       └── app.js
└── pages/
    └── materias/
        ├── portugues/
        ├── ingles/
        ├── matematica/
        ├── fisica/
        ├── quimica/
        ├── biologia/
        ├── historia/
        ├── geografia/
        ├── filosofia/
        ├── sociologia/
        ├── programacao/
        └── autoria-web/
```

## Design

A interface foi construída com uma arquitetura de tokens (primitivos → semânticos → componentes), hierarquia editorial, glassmorphism contido, profundidade espacial e movimento funcional. As animações priorizam feedback, consistência espacial, `transform`/`opacity`, curvas `ease-out` fortes e redução de movimento quando solicitada pelo sistema.

Não há backend nesta versão. O progresso é local ao navegador/dispositivo.
