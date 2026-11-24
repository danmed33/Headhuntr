<p align="center">
  <img src="assets/banner.png" alt="HEADHUNTR" width="100%" />
</p>

<h3 align="center">Seu relatório diário de vagas, com a pessoa certa pra abordar. 🔎 → 🤝</h3>

<p align="center">
  O <b>HEADHUNTR</b> é um agente de IA que procura vagas por você, analisa o fit de cada uma<br/>
  e entrega, todo dia de manhã, um relatório pronto, com <b>quem abordar</b> nas melhores vagas.
</p>

<p align="center">
  <a href="https://headhuntr-v1.lovable.app"><img alt="Ver o site" src="https://img.shields.io/badge/ver_o_site-headhuntr--v1.lovable.app-2b5bff?style=for-the-badge&labelColor=1a1a1a"></a>
</p>

<p align="center"><sub>Esta é a vitrine pública do projeto. O código-fonte é privado.</sub></p>

---

<p align="center">
  <img src="assets/headhuntr-demo.gif" alt="Demonstração do HEADHUNTR: a home, o envio do currículo, o agente trabalhando e o relatório com a vaga, a análise e o contato" width="100%" />
</p>
<p align="center"><sub>Do currículo ao relatório: o perfil é montado a partir do CV, o agente trabalha e o relatório chega com a análise de cada vaga e o contato para abordar.</sub></p>

<table>
  <tr>
    <td align="center" width="33%"><h2>20 mil+</h2><sub>vagas lidas todos os dias, em 8 fontes e 60+ sites de carreira</sub></td>
    <td align="center" width="33%"><h2>1.200+</h2><sub>contatos de RH e liderança em 700+ empresas, num banco que cresce a cada relatório</sub></td>
    <td align="center" width="33%"><h2>50%</h2><sub>dos usuários do piloto marcaram entrevista na primeira semana, pelos contatos entregues</sub></td>
  </tr>
</table>

## O problema

Quem procura emprego passa horas em sites de vagas, se candidata às cegas e quase nunca fala com uma pessoa. Achar vagas é fácil. O difícil é saber **quais realmente combinam** com a sua trajetória e **quem, dentro da empresa, vale a pena procurar**.

## O produto

O HEADHUNTR não é um site de vagas: o usuário não busca nada. Ele envia o currículo uma vez e, a partir daí, um agente trabalha por ele todos os dias.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="assets/passo-1-perfil.png" alt="Perfil montado a partir do currículo, com cargos desejados e modelo de trabalho" /><br/>
      <b>1 · CONTEXTO</b><br/>
      <sub>O currículo vira um perfil: cargos-alvo, nível, cidade e modelo de trabalho.</sub>
    </td>
    <td align="center" width="33%">
      <img src="assets/passo-2-agente.png" alt="O agente trabalhando: lendo o currículo, pesquisando, validando e comparando vagas" /><br/>
      <b>2 · O AGENTE TRABALHA</b><br/>
      <sub>Busca, confere se a vaga está aberta, compara com a trajetória e mapeia pessoas.</sub>
    </td>
    <td align="center" width="33%">
      <img src="assets/passo-3-relatorio.png" alt="Card do relatório com o motivo do match, pontos fortes, veredito e o contato encontrado" /><br/>
      <b>3 · RELATÓRIO COM QUEM ABORDAR</b><br/>
      <sub>Até 7 vagas por dia, com nota de fit, pontos fortes, gaps, veredito e o contato.</sub>
    </td>
  </tr>
</table>

> Em um dos relatórios do piloto, o contato indicado era exatamente a recrutadora que já estava entrevistando aquele usuário para a mesma vaga.

## Meu papel

Concebi e conduzo o HEADHUNTR de ponta a ponta, como fundador solo: a ideia, o posicionamento, a marca, a experiência e, principalmente, **o desenho do motor**: como as vagas são encontradas, filtradas, analisadas e entregues, com custo de centavos por relatório.

Também opero o piloto com usuários reais: acompanho cada rodada diária, transformo cada falha em regra do sistema e revisei pessoalmente mais de mil contatos que formam o banco de contatos. A implementação foi feita com o **Lovable** e o **Claude** como pares de engenharia, sob a minha direção. A arquitetura, as regras e cada decisão de produto são minhas.

## Como o agente funciona

```mermaid
flowchart LR
  A["07:00 · Banco de vagas do dia<br/>sem IA"] --> B["07:30 · Um relatório por usuário<br/>em paralelo, com repetição automática"]
  B --> C["Filtros<br/>cargo · nível · cidade · já entregue"]
  C --> D["A vaga ainda está aberta?"]
  D --> E["Triagem<br/>IA rápida ranqueia candidatas"]
  E --> F["Análise de fit<br/>IA detalhada, vaga a vaga"]
  F --> G["Contatos<br/>banco próprio primeiro"]
  G --> H["Relatório<br/>até 7 vagas"]
```

- **Um banco de vagas por dia, para todos.** As fontes são lidas uma única vez de manhã, em centenas de partes pequenas e independentes. Os relatórios leem esse banco pronto: 100 usuários não significam 100 buscas.
- **Etapas pequenas, que se recuperam sozinhas.** Cada relatório anda em passos curtos e salva o estado a cada passo. Uma falha custa só uma nova tentativa, nunca o relatório do dia.
- **100% automático.** Do banco de vagas à entrega, tudo roda pelo próprio servidor, todos os dias, sem ninguém apertar botão.

## Decisões de produto

- **IA só onde ela agrega julgamento.** Cargo, nível, cidade e repetição são resolvidos por regras, de graça. A IA só entra para ranquear e analisar uma lista curta de vagas.
- **Contato de graça antes do contato pago.** O sistema consulta primeiro o próprio banco de contatos e só faz uma busca paga quando falta, com limite por relatório.
- **Nunca repetir uma vaga.** O que já foi entregue, ou descartado há pouco tempo, não volta.
- **Variedade no relatório.** No máximo uma vaga por empresa e poucas por fonte, salvo quando faltam vagas boas.
- **Respeitar o que o usuário marcou.** Quem escolheu Rio de Janeiro recebe vagas do Rio ou remotas, nada além disso.
- **Transparência quando há poucas vagas.** Em dias fracos, as vagas quase aprovadas aparecem no fim, sinalizadas como de menor aderência.
- **Testar antes de ligar.** Toda mudança de regra passa antes por um laboratório com perfis de teste, e só depois vale para os usuários.

## Construído com

TanStack Start · React · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, pg_cron) · OpenAI · Stripe · Lovable

---

<p align="center">
  <sub>Criado por <b>Daniel Medeiros</b> · <a href="https://headhuntr-v1.lovable.app">headhuntr-v1.lovable.app</a></sub>
</p>
