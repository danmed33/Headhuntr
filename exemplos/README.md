# Trechos do código

Uma amostra de como o HEADHUNTR é construído, para leitura. **O projeto completo é privado.** Aqui não há chaves, dados de usuários, fontes de vagas, busca de contatos nem as instruções da IA.

| Arquivo | O que mostra |
|---|---|
| [`src/relatorio.ts`](src/relatorio.ts) | As regras que montam o relatório diário: no máximo 1 vaga por empresa e 2 por fonte, afrouxando só quando faltam vagas boas, e a troca por vagas com contato sem quebrar essas regras. |
| [`src/empresa.ts`](src/empresa.ts) | O nome da empresa como uma pessoa usaria (sem LTDA, S/A…) e como reconhecer a mesma empresa quando o site de vagas enfeita o nome, sem confundir "DATA STONE" com a Stone. |
| [`src/nivel.ts`](src/nivel.ts) | O nível do perfil: até 2 opções vizinhas e os níveis de vaga que cada escolha busca. |
| [`src/animacoes.ts`](src/animacoes.ts) · [`src/animacoes.css`](src/animacoes.css) | As animações de entrada da home, sem biblioteca: o painel que se monta peça por peça, entradas ao rolar e hover leve. Respeitam quem prefere menos movimento e nunca escondem o conteúdo se o JavaScript falhar. |
| [`test/`](test) | Os testes automáticos desses trechos, que rodam a cada mudança (selo **CI** no topo do repositório). |

```bash
cd exemplos
npm install
npm test
```

© Daniel Medeiros. Todos os direitos reservados. Código publicado só para leitura.
