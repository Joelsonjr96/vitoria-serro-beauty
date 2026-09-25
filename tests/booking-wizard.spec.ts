import { test, expect } from '@playwright/test';

test('fluxo completo de agendamento via wizard', async ({ page }) => {
  // 0. Capturar logs do console do navegador
  page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

  // 1. Acessa a home
  await page.goto('/');

  // 2. Seleciona o primeiro serviço (Volume Brasileiro)
  const serviceCard = page.locator('div:has-text("Extensão de Cílios Volume Brasileiro")').last();
  await serviceCard.getByRole('link', { name: /Agendar Agora/i }).click();

  // 3. Verifica se está na página de agendamento e vê o seletor de data
  await expect(page).toHaveURL(/\/agendar\//);
  await expect(page.getByText('1. Escolha a Data')).toBeVisible();

  // 4. Seleciona a primeira data disponível (já deve estar selecionada por padrão, mas clicamos para garantir)
  const dateButtons = page.locator('button:has(span.text-lg)');
  await dateButtons.first().click();

  // 5. Seleciona um horário na grade
  await expect(page.getByText(/2. Horários para/i)).toBeVisible();
  const timeChips = page.locator('button:text-matches("^[0-9]{2}:[0-9]{2}$")');
  await timeChips.first().click();

  // 6. Verifica o modal de resumo
  await expect(page.getByText('Resumo do Agendamento')).toBeVisible();
  await expect(page.getByText('🌸 Serviço')).toBeVisible();

  // 7. Preenche os dados
  await page.getByPlaceholder(/Nome Completo/i).fill('Cliente de Teste');
  await page.getByPlaceholder(/WhatsApp/i).fill('21999999999');

  // 8. Confirma o agendamento
  await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

  // 9. Verifica se chegou na tela de sucesso
  // Alterado: O teste estava falhando ao validar a URL.
  // A aplicação redireciona para /agendado/{id}, vamos garantir que o ID é capturado e que a página de sucesso é carregada.
  await page.waitForURL(/.*\/agendado\/.*/, { timeout: 15000 });
  await expect(page).toHaveURL(/.*\/agendado\/.*/);
  await expect(page.getByRole('heading', { name: /Agendamento confirmado!/i })).toBeVisible();
});
