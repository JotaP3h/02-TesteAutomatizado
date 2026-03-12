import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  
  test.beforeEach(async ({ page }) => {
    // Aponta para o arquivo index.html dentro da sua pasta docs local
    const filePath = path.resolve(__dirname, '../../docs/index.html');
    await page.goto(`file://${filePath}`);
  });

  // ========== GRUPO 1: Cadastro e Validações ==========
  test.describe('Cadastro e Validações', () => {
    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verifica se a linha foi criada
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      // Busca especificamente a célula do nome para evitar conflito com a mensagem de sucesso
      await expect(page.locator('#tabela-alunos tbody td').filter({ hasText: /^João Silva$/ })).toBeVisible();
    });

    test('não deve aceitar notas fora do intervalo 0-10', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Inválido');
      await page.getByLabel('Nota 1').fill('11');
      await page.getByLabel('Nota 2').fill('-1');
      await page.getByLabel('Nota 3').fill('5');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A tabela deve permanecer vazia (exibindo a mensagem padrão)
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });
  });

  // ========== GRUPO 2: Cálculo de Média ==========
  test.describe('Cálculo de Média', () => {
    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (8 + 6 + 10) / 3 = 8.00
      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });
  });

  // ========== GRUPO 3: Busca e Exclusão ==========
  test.describe('Busca e Exclusão', () => {
    test('deve filtrar corretamente na busca por nome', async ({ page }) => {
      // Cadastro 1
      await page.getByLabel('Nome do Aluno').fill('Ana Clara');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Cadastro 2
      await page.getByLabel('Nome do Aluno').fill('Bruno Silva');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('8');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Filtro
      await page.getByPlaceholder('Filtrar alunos...').fill('Ana');

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.locator('#tabela-alunos tbody')).toContainText('Ana Clara');
      await expect(page.locator('#tabela-alunos tbody')).not.toContainText('Bruno Silva');
    });

    test('deve excluir um aluno e esvaziar a tabela', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Carlos Eduardo');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Clica no botão de excluir
      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });
  });

  // ========== GRUPO 4: Situações e Estatísticas ==========
  test.describe('Cálculo de Situação', () => {
    test('deve exibir situação Aprovado (Média >= 7)', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9'); 
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verifica se o badge de Aprovado está na linha
      const situacao = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(5);
      await expect(situacao).toContainText('Aprovado');
    });

    test('deve exibir situação Reprovado (Média < 5)', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('4');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('4'); 
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(5);
      await expect(situacao).toContainText('Reprovado');
    });

    test('deve atualizar os cards de estatísticas', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Aluno A');
        await page.getByLabel('Nota 1').fill('10');
        await page.getByLabel('Nota 2').fill('10');
        await page.getByLabel('Nota 3').fill('10');
        await page.getByRole('button', { name: 'Cadastrar' }).click();

        await expect(page.locator('#stat-total')).toHaveText('1');
        await expect(page.locator('#stat-aprovados')).toHaveText('1');
    });
  });

});