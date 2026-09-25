import { test, expect } from '@playwright/test';

// Aumenta o tempo limite global
test.use({ actionTimeout: 30000 });

test.describe('Fluxo Vitória Serro Beauty', () => {

  test('Fluxo completo: agendar, ver no painel e cancelar', async ({ page }) => {
    // 1. Cliente: Agendar
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Espera o botão de Agendar aparecer e clica
    const btnAgendar = page.getByRole('link', { name: 'Agendar Agora' }).first();
    await btnAgendar.waitFor({ state: 'visible' });
    await btnAgendar.click();

    // Seleciona um horário
    const btnHorario = page.locator('button.bg-button-bg').first();
    await btnHorario.waitFor({ state: 'visible' });
    await btnHorario.click();

    // Preenche formulário
    const inputNome = page.getByPlaceholder('Nome Completo');
    await inputNome.waitFor({ state: 'visible' });
    await inputNome.fill('Cliente Teste');
    await page.getByPlaceholder('WhatsApp (com DDD)').fill('21999999999');
    await page.getByRole('button', { name: 'Confirmar Agendamento' }).click();

    // Verifica redirecionamento
    await expect(page).toHaveURL(/.*agendar/);
    await expect(page.locator('h1')).toContainText('Agendamento confirmado');

    // 2. Painel Profissional: Verificar
    await page.goto('http://localhost:3000/prof', { waitUntil: 'domcontentloaded' });

    // Espera o Cliente Teste aparecer na tela
    const clienteNaFila = page.locator('text=Cliente Teste');
    await clienteNaFila.waitFor({ state: 'visible' });
    await expect(clienteNaFila).toBeVisible();

    // 3. Cancelamento
    await page.goBack();
    await page.click('button:has-text("Cancelar Agendamento")');
    await expect(page.locator('h1')).toContainText('Agendamento Cancelado');

    await page.goto('http://localhost:3000/prof', { waitUntil: 'domcontentloaded' });
    await expect(clienteNaFila).not.toBeVisible();
  });

  test('Configurações: Alterar dados básicos', async ({ page }) => {
    await page.goto('http://localhost:3000/prof', { waitUntil: 'domcontentloaded' });

    // Debug: ver labels
    const labels = await page.locator('label').allTextContents();
    console.log('Labels encontrados:', labels);

    // Espera o input aparecer antes de preencher
    const input = page.getByLabel('WhatsApp');
    await input.waitFor({ state: 'visible' });

    await input.fill('21000000000');
    await input.blur();

    await page.reload({ waitUntil: 'networkidle' });
    // Espera o input carregar novamente após o reload
    await input.waitFor({ state: 'visible' });
    await expect(input).toHaveValue('21000000000');
  });
});
