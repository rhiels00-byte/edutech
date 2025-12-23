import { test, expect } from '@playwright/test';

test.describe('UI flow QA', () => {
  test('home/class/note flows', async ({ page }) => {
    const pageErrors = [];
    const consoleErrors = [];

    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('dialog', (dialog) => dialog.accept());

    await page.goto('/');

    const lnb = page.locator('div').filter({ has: page.getByText('에듀테크') }).first();

    // LNB: 홈 -> 우리 반
    await lnb.getByRole('button', { name: '홈' }).first().click();
    await lnb.getByRole('button', { name: '우리 반' }).first().click();
    await expect(page.getByRole('heading', { name: /우리 반/ })).toBeVisible();

    // 우리 반: 학생 메시지 -> 개별 채팅
    const firstRow = page.getByRole('row', { name: /김서준/ });
    await firstRow.getByRole('button', { name: '💬 메시지' }).click();
    await expect(page.getByRole('button', { name: '📋 전체 보기' })).toBeVisible();
    await page.getByRole('button', { name: '← 뒤로' }).click();

    // 우리 반: 전체 메시지
    await page.getByRole('button', { name: '💬 전체 메시지' }).click();
    await expect(page.getByRole('heading', { name: '💬 메시지' })).toBeVisible();
    await lnb.getByRole('button', { name: '우리 반' }).first().click();

    // 우리 반: 메모 추가/필터
    await firstRow.getByRole('button', { name: '📌' }).click();
    await expect(page.getByText('메모장은')).toBeVisible();
    await expect(page.getByText('김서준 학생 필터')).toBeVisible();
    await lnb.getByRole('button', { name: '홈' }).first().click();

    // 우리 반: 리워드
    await lnb.getByRole('button', { name: '우리 반' }).first().click();
    await firstRow.getByRole('button', { name: /❤️/ }).click();
    await expect(page.getByRole('heading', { name: /리워드 관리/ })).toBeVisible();
    await lnb.getByRole('button', { name: '우리 반' }).first().click();

    // 오늘 페이지: 알림장 -> 노트
    await lnb.getByRole('button', { name: '홈' }).first().click();
    await expect(page.getByText('오늘의 할 일')).toBeVisible();
    await page.getByRole('button', { name: /수정하기/ }).click();
    await expect(page.getByRole('heading', { name: /노트/ })).toBeVisible();

    // 노트: 탭 전환
    await page.getByRole('button', { name: /메모장/ }).click();
    await expect(page.getByText('메모장은')).toBeVisible();
    await page.getByRole('button', { name: /알림장/ }).click();

    // 노트: 등록/수정/삭제/고정
    const noticeContent = 'QA 알림장 테스트';
    const updatedContent = 'QA 알림장 수정';
    await page.getByPlaceholder('학생들에게 전달할 알림장 내용을 입력하세요...').fill(noticeContent);
    await page.getByRole('button', { name: '등록하기' }).click();
    const noticeCard = page.getByText(noticeContent).locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]');
    await expect(noticeCard).toBeVisible();
    await noticeCard.getByRole('button', { name: '수정' }).click();
    await page.getByPlaceholder('학생들에게 전달할 알림장 내용을 입력하세요...').fill(updatedContent);
    await page.getByRole('button', { name: '수정 완료' }).click();
    const updatedCard = page.getByText(updatedContent).locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]');
    await expect(updatedCard).toBeVisible();
    await updatedCard.getByRole('button', { name: /고정/ }).click();
    await updatedCard.getByRole('button', { name: '삭제' }).click();

    // 오늘 페이지: 최근 활동 더보기
    await lnb.getByRole('button', { name: '홈' }).first().click();
    await expect(page.getByText('오늘의 할 일')).toBeVisible();
    await page.getByRole('button', { name: /더보기/ }).click();
    await expect(page.getByRole('heading', { name: /최근 활동/ })).toBeVisible();

    expect(pageErrors, `Page errors: ${pageErrors.map(String).join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });

  test('textbook right panel toggle', async ({ page }) => {
    await page.goto('/');

    const lnb = page.locator('div').filter({ has: page.getByText('에듀테크') }).first();
    await lnb.getByRole('button', { name: '📖 교과서' }).first().click();

    const toolHeader = page.getByText('도구', { exact: true }).locator('..');
    await expect(page.getByText('도구', { exact: true })).toBeVisible();
    await toolHeader.getByRole('button', { name: '›' }).click();
    await expect(page.getByText('도구', { exact: true })).toBeHidden();
    await page.locator('button.bg-slate-700', { hasText: '‹' }).click();
    await expect(page.getByText('도구', { exact: true })).toBeVisible();
  });
});
