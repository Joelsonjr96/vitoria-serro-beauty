import { test, expect } from '@playwright/test';

test('acesso à tela de profissional requer senha', async ({ page }) => {
  // Acessa a página de profissional
  await page.goto('/prof');

  // Verifica se o campo de senha está presente
  const passwordInput = page.getByTestId('password-input');
  await expect(passwordInput).toBeVisible();

  // Tenta entrar com senha errada
  await passwordInput.fill('errada');
  await page.getByTestId('login-button').click();

  // Verifica se ainda está na tela de proteção
  await expect(passwordInput).toBeVisible();

  // Entra com a senha correta (definida em .env.local)
  await passwordInput.fill('vitoria123');
  await page.getByTestId('login-button').click();

  // Verifica se o conteúdo protegido está visível
  await expect(page.locator('h1:has-text("Minha Agenda")')).toBeVisible();
});
