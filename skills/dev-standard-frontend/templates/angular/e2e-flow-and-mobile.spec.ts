import { expect, Page, test } from '@playwright/test';

async function addEntry(page: Page, title: string, notes = '') {
  await page.getByLabel('Título').fill(title);
  await page.getByLabel('Notas').fill(notes);
  await page.getByRole('button', { name: 'Guardar' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('flujo de la agenda', () => {
  test('muestra el estado vacío al inicio', async ({ page }) => {
    await expect(page.getByText('Aún no tienes entradas')).toBeVisible();
    await expect(page.getByTestId('pending-count')).toHaveText('0 pendientes');
  });

  test('valida el título requerido', async ({ page }) => {
    await page.getByRole('button', { name: 'Guardar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Este campo es requerido');
  });

  test('crea, completa, persiste tras recargar y elimina una entrada', async ({ page }) => {
    await addEntry(page, 'Dentista', 'Llevar radiografías');

    await expect(page.getByText('Dentista')).toBeVisible();
    await expect(page.getByText('Llevar radiografías')).toBeVisible();
    await expect(page.getByTestId('pending-count')).toHaveText('1 pendiente');

    await page.reload();
    await expect(page.getByText('Dentista')).toBeVisible();

    await page.getByRole('checkbox', { name: 'Completar Dentista' }).check();
    await expect(page.getByTestId('pending-count')).toHaveText('0 pendientes');

    await page.getByRole('button', { name: 'Eliminar Dentista' }).click();
    await expect(page.getByText('Dentista')).toHaveCount(0);
    await expect(page.getByText('Aún no tienes entradas')).toBeVisible();
  });
});

test.describe('responsive en móvil (360px)', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('no hay scroll horizontal ni con títulos largos sin espacios', async ({ page }) => {
    await addEntry(page, 'A'.repeat(80), 'B'.repeat(120));

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(overflows).toBe(false);
  });

  test('los controles táctiles miden al menos 44px', async ({ page }) => {
    await addEntry(page, 'Dentista');

    for (const locator of [
      page.getByRole('button', { name: 'Guardar' }),
      page.getByRole('button', { name: 'Eliminar Dentista' }),
      page.getByLabel('Título'),
    ]) {
      const box = await locator.boundingBox();

      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});
