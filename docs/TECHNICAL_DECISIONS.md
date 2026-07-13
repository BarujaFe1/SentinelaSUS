# Technical Decisions — SentinelaSUS

## 1. Dados 100% sintéticos

**Decisão:** nunca usar dados reais de vigilância.  
**Por quê:** portfólio seguro, LGPD-friendly, seed reproduzível (42).  
**Trade-off:** não valida epidemiologia do mundo real.

## 2. DataStore em memória

**Decisão:** carregar gold Parquet no boot via `DataStore`.  
**Por quê:** ~37k linhas cabem em memória; API simples e rápida para demo.  
**Trade-off:** cold start carrega tudo; não escala para milhões de linhas.

## 3. Baseline por semana epidemiológica (reported_cases)

**Decisão:** média/desvio/MAD dos `reported_cases` na mesma semana ao longo dos anos.  
**Por quê:** alinhado à leitura de sazonalidade semanal.  
**Trade-off:** MVP inclui o ano avaliado na agregação (documentado). Leave-one-out no roadmap.

## 4. Dois detectores (z-score + MAD)

**Decisão:** z-score como padrão de classificação; MAD como comparação.  
**Por quê:** ensina incerteza metodológica sem crowning de um único método.  
**Trade-off:** UI precisa deixar explícito que não há “vencedor”.

## 5. Brief determinístico + termos proibidos

**Decisão:** template + `ValueError` se termo alarmista aparecer.  
**Por quê:** Responsible Analytics verificável em testes.  
**Trade-off:** texto menos “fluido” que LLM; aceitável e desejável aqui.

## 6. API pública sem auth

**Decisão:** GET-only sem autenticação.  
**Por quê:** demo pública.  
**Trade-off:** precisa rate-limit/ops se viralizar; fora do escopo MVP.

## 7. Frontend bake-time `NEXT_PUBLIC_API_URL`

**Decisão:** URL da API no build do Next.  
**Por quê:** padrão Next.js.  
**Trade-off:** troca de backend exige redeploy do frontend.
