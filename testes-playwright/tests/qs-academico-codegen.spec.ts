import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://jotap3h.github.io/02-TesteAutomatizado/');
  await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - banner:
      - heading "QS Acadêmico" [level=1]
      - paragraph: Sistema de Gestão de Notas
    `);
  await page.getByRole('button', { name: 'Limpar Tudo' }).click();
  await page.getByRole('textbox', { name: 'Nome do Aluno' }).click();
  await page.getByRole('textbox', { name: 'Nome do Aluno' }).fill('gdfgdfg');
  await page.getByRole('spinbutton', { name: 'Nota 1' }).click();
  await page.getByRole('spinbutton', { name: 'Nota 1' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Nota 2' }).click();
  await page.getByRole('spinbutton', { name: 'Nota 2' }).fill('5');
  await page.getByRole('spinbutton', { name: 'Nota 3' }).click();
  await page.getByRole('spinbutton', { name: 'Nota 3' }).fill('3');
  await page.getByRole('button', { name: 'Cadastrar' }).click();
  await page.getByRole('textbox', { name: 'Buscar por nome' }).click();
});