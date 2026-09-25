import { test, expect } from '@playwright/test';

test('botões de ação possuem feedback tátil', async ({ page }) => {
  await page.goto('/');

  const agendarButton = page.getByRole('link', { name: /Agendar Agora/i }).first();

  // Verifica se o botão tem a classe de transição correta
  await expect(agendarButton).toHaveClass(/transition-all/);

  // Verifica se o estado active aplica a transformação
  await expect(agendarButton).toHaveClass(/active:scale-\[0\.98\]/);
});
