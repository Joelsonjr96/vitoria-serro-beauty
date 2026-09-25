import { test, expect } from '@playwright/test';

test.describe('Verificação de Identidade Visual e Coerência de Marca', () => {

  test.beforeEach(async ({ page }) => {
    // Configura o viewport para simular um mobile e desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Consistência da Identidade Visual no Front-end (Cliente)', async ({ page }) => {
    await page.goto('/');

    // 1. Verificação do Header (Logo Preta)
    const headerLogo = page.locator('header img[alt*="Logo"]');
    await expect(headerLogo).toBeVisible();
    const headerSrc = await headerLogo.getAttribute('src');
    // Ajustado para aceitar espaços ou %20
    expect(headerSrc?.replace(/%20/g, ' ')).toContain('LOGO PRETA.png');

    // 2. Verificação da Hero Section (Identidade de Luxo)
    // Procura por qualquer imagem cujo src contenha "LOGO DOURADA"
    const goldLogo = page.locator('img[src*="LOGO DOURADA"]').first();
    await expect(goldLogo).toBeVisible();

    // Verificação de textos da Hero (Luxo)
    await expect(page.getByText('Técnica, Leveza e Precisão', { exact: false })).toBeVisible();

    // 3. Verificação dos Cards de Serviço (Assinatura VS)
    const cardLogo = page.locator('.bg-bg-card img[alt*="VS"]').first();
    await expect(cardLogo).toBeVisible();
    const cardLogoSrc = await cardLogo.getAttribute('src');
    expect(cardLogoSrc?.replace(/%20/g, ' ')).toContain('LOGO PRETA.png');

    // 4. Verificação do Rodapé (Identidade Escura de Luxo)
    const footer = page.locator('footer');
    // Verifica se a classe de fundo lilás escuro está presente (escapando o caractere [)
    await expect(footer).toHaveClass(/bg-\[#2D1B2D\]/);
    const footerLogo = footer.locator('img[src*="LOGO DOURADA"]');
    await expect(footerLogo).toBeVisible();
    await expect(footer).toContainText('Av. Braz de Pina 1720');
  });

  test('Consistência no Fluxo de Agendamento', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Agendar Agora/i }).first().click();

    // Verifica se o Header com a logo continua presente
    const headerLogo = page.locator('header img');
    await expect(headerLogo.first()).toBeVisible();

    // Verifica elementos do Wizard
    await expect(page.getByText('1. Escolha a Data')).toBeVisible();
  });

  test('Consistência no Painel Profissional', async ({ page }) => {
    await page.goto('/prof');

    // Verifica se a tela de login profissional está com a marca
    await expect(page.getByText('Acesso Profissional')).toBeVisible();

    // Faz login para verificar o painel interno
    const passwordInput = page.getByTestId('password-input');
    await passwordInput.fill('vitoria123');
    await page.getByTestId('login-button').click();

    // Verifica a Logo no Dashboard Profissional
    const profLogo = page.locator('header img');
    await expect(profLogo.first()).toBeVisible();
    const profLogoSrc = await profLogo.first().getAttribute('src');
    expect(profLogoSrc?.replace(/%20/g, ' ')).toContain('LOGO PRETA.png');

    // Verifica métricas
    await expect(page.getByText('Hoje', { exact: true })).toBeVisible();
    await expect(page.getByText('Na Semana', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Pendente', { exact: true })).toBeVisible();
  });

  test('Verificação de Paleta de Cores e Tipografia (Integridade)', async ({ page }) => {
    await page.goto('/');

    // Verifica se a fonte Serifada (Playfair Display) está sendo usada em títulos
    const h2 = page.locator('h2').first();
    const fontFamily = await h2.evaluate((el) => window.getComputedStyle(el).fontFamily);
    // Ajustado para o nome real da fonte renderizada
    expect(fontFamily.toLowerCase()).toContain('playfair display');

    // Verifica cor de fundo da página (Off-white)
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    // rgb(250, 247, 245) é o equivalente a #FAF7F5
    expect(bodyBg).toBe('rgb(250, 247, 245)');
  });
});
