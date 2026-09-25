import { test, expect } from '@playwright/test';

test.describe('Verificação de Páginas do Projeto', () => {

  test('Página Inicial (Home)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vitória Serro Beauty/);
    // Verifica a logo no primeiro header (navegação)
    await expect(page.locator('header').first().locator('img')).toBeVisible();

    // Verifica se os serviços estão carregados
    const serviceCards = page.locator('.bg-bg-card');
    await expect(serviceCards.first()).toBeVisible();

    // Verifica o rodapé com o novo endereço
    await expect(page.locator('footer')).toContainText('Av. Braz de Pina 1720');
    await expect(page.locator('footer')).toContainText('Vista Alegre, Rio de Janeiro - RJ');
  });

  test('Página de Agendamento de Serviço', async ({ page }) => {
    await page.goto('/');
    // Clica no primeiro serviço disponível
    await page.getByRole('link', { name: /Agendar Agora/i }).first().click();

    await expect(page).toHaveURL(/\/agendar\//);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('1. Escolha a Data')).toBeVisible();
  });

  test('Página de Proteção Profissional', async ({ page }) => {
    await page.goto('/prof');
    await expect(page.getByText('Acesso Profissional')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
  });

  test('Fluxo de Agendamento e Cancelamento pelo Cliente', async ({ page }) => {
    // 1. Faz um agendamento real (ou simulado se possível)
    await page.goto('/');
    await page.getByRole('link', { name: /Agendar Agora/i }).first().click();

    // Seleciona data e hora
    await page.locator('button:has(span.text-lg)').first().click();
    await page.locator('button:text-matches("^[0-9]{2}:[0-9]{2}$")').first().click();

    // Preenche dados
    await page.getByPlaceholder('Nome Completo').fill('Teste Playwright');
    await page.getByPlaceholder('WhatsApp (com DDD)').fill('21999999999');

    // Confirma
    await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

    // 2. Verifica se está na página de agendado
    await expect(page).toHaveURL(/\/agendar\//);
    await expect(page.getByRole('heading', { name: /Agendamento confirmado!/i })).toBeVisible();
    await expect(page.getByText('Av. Braz de Pina 1720 - Vista Alegre')).toBeVisible();

    // 3. Testa o botão de Cancelar Agendamento
    await page.getByRole('button', { name: /Cancelar Agendamento/i }).click();

    // 4. Verifica se a tela de confirmação de cancelamento aparece
    await expect(page.getByRole('heading', { name: /Agendamento Cancelado/i })).toBeVisible();
    await expect(page.getByText('Seu agendamento foi cancelado com sucesso')).toBeVisible();
    await expect(page.getByRole('link', { name: /Escolher Novo Horário/i })).toBeVisible();
  });
});
