```markdown
# GamingRent — Plataforma de Aluguel de Videogames

Aplicativo frontend desenvolvido para a disciplina de **Cross-Platform Application Development** (FIAP - 2º Ano, Turma: 2CCPW).

## Integrantes do Grupo e Papéis
* **Guilherme Ferraz de Medeiros (RM: 564743)** — Arquiteto de Software & Desenvolvedor Frontend (Lead)
* **Roberto Marques Moreira (RM: 564935)** — UI/UX Designer, Prototipagem & Documentação

---

## 1. Visão Geral e Proposta de Valor
O **GamingRent** é uma plataforma digital voltada para a locação de jogos de videogame (físicos e digitais) para diferentes plataformas (PlayStation, Xbox e Nintendo Switch). O aplicativo democratiza o acesso aos games por meio de um sistema de assinatura flexível e aluguel avulso, permitindo que os jogadores desfrutem dos principais lançamentos e clássicos sem precisar pagar o preço cheio de aquisição de cada título.

## 2. Descrição do Problema e Público-Alvo
* **O Problema:** Os jogos de videogame atuais possuem custos elevados de lançamento, o que limita o acesso de grande parte dos jogadores a um catálogo diversificado. Além disso, muitos títulos são finalizados rapidamente e ficam parados na prateleira, gerando desperdício financeiro.
* **Público-Alvo:** Gamers entusiastas, pais em busca de alternativas econômicas para entretenimento e jogadores casuais que desejam testar títulos antes de comprá-los de forma definitiva.

## 3. Principais Funcionalidades do MVP
1. **Catálogo de Jogos:** Listagem interativa com filtros por plataforma (PS5, Xbox, Switch), gênero e lançamentos.
2. **Gestão de Aluguel:** Escolha de período de locação (7, 15 ou 30 dias) e adesão a planos de assinatura mensais.
3. **Painel do Usuário:** Acompanhamento de jogos alugados ativos, prazos de devolução e histórico de pedidos.
4. **Wishlist (Lista de Desejos):** Seção de favoritos para acompanhar a chegada de novos títulos.

## 4. Identidade Visual e Marca
* **Naming Rationale:** Combinação de *Gaming* (jogos) e *Rent* (aluguel), criando um conceito direto, moderno e de fácil memorização no universo dos games.
* **Tom de Voz:** Jovem, dinâmico, acessível e gamer.
* **Paleta de Cores:** * Roxo Escuro / Gamer (`#1A0B2E`) — Fundo principal e imersão
  * Azul Neon (`#00F0FF`) / Verde Neon (`#39FF14`) — Ações e destaques visuais
  * Branco (`#FFFFFF`) — Contraste e legibilidade de textos
* **Tipografia:** Família *Poppins* ou *Montserrat* (pesos Bold e Regular).

## 5. Modelo de Negócio e Pitch
* **Ideia de Venda (Pitch):** "Comprar todos os lançamentos de videogame custa caro e acumula jogos parados na estante. Com o GamingRent, você aluga ou assina os melhores títulos por uma fração do preço, joga o quanto quiser, e troca por outro jogo assim que zerar."
* **Modelo de Negócio:** Assinatura mensal recorrente (SaaS) em diferentes tiers e modalidade de aluguel avulso por jogo.

---

## Requisitos Técnicos e Execução

- Node.js 18 ou superior
- npm

### Instalação

No diretório do projeto, execute:

```bash
npm install

```

### Executar em modo de desenvolvimento

```bash
npm run dev -- --host 0.0.0.0 --port 4173

```

A aplicação ficará disponível em:

```text
http://localhost:4173/

```

> A porta 4173 foi escolhida porque a 5173 pode já estar em uso em algumas máquinas.

### Build de produção

```bash
npm run build

```

### Preview da build

```bash
npm run preview -- --host 0.0.0.0 --port 4173

```

### Estrutura principal

```text
CP456-CPAD-guif/
├── .figma/
│   └── make/
│       └── site.json
├── dist/
│   ├── assets/
│   └── index.html
├── node_modules/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts

```
### Prints do Aplicativo
##  Tela de login
<img width="818" height="907" alt="Screenshot_213" src="https://github.com/user-attachments/assets/8b19c2e5-0679-4fa1-a483-f716a614bc12" />
## Tela de catálogo
<img width="818" height="907" alt="Screenshot_212" src="https://github.com/user-attachments/assets/e7dc3d04-616b-4c81-8993-6207e85be0cf" /> 
<img width="818" height="907" alt="Screenshot_214" src="https://github.com/user-attachments/assets/6ea2d523-0f69-422f-9c20-768cd738fe15" />
## Feedback visual de agendamento concluído
<img width="818" height="907" alt="Screenshot_215" src="https://github.com/user-attachments/assets/01fde654-4d4d-4467-a4d9-c51d9a55302a" /> 
## Tela de perfil
<img width="818" height="907" alt="Screenshot_217" src="https://github.com/user-attachments/assets/d834b8f6-d871-440d-a336-648230d14215" /> 

```

```
