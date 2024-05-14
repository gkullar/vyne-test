import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { render, screen } from '@testing-library/angular';
import { createMockWithValues } from '@testing-library/angular/jest-utils';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';

import { PaymentsContainerComponent } from './payments-container.component';
import { MOCK_PAGINATED_PAYMENTS } from '../mocks';
import { PaymentTransactionStatus } from '../models';
import { INITIAL_STATE, State, PaymentsStore } from '../store';

const setup = async ({ data, loading, hasFilters }: Partial<State>) => {
  const onPageChangedMockFn = jest.fn();
  const onFiltersChangedMockFn = jest.fn();
  const onClearFilters = jest.fn();

  TestBed.overrideProvider(PaymentsStore, {
    useValue: createMockWithValues(PaymentsStore, {
      fetchData: jest.fn(),
      onPageChanged: onPageChangedMockFn,
      onFiltersChanged: onFiltersChangedMockFn,
      onClearFilters: onClearFilters,
      vm$: of({
        ...INITIAL_STATE,
        data: data || INITIAL_STATE.data,
        loading: loading || INITIAL_STATE.loading,
        hasFilters: hasFilters || INITIAL_STATE.hasFilters
      })
    })
  });

  const user = userEvent.setup({
    advanceTimers: (delay) => jest.advanceTimersByTime(delay)
  });

  const renderResult = await render(PaymentsContainerComponent, {
    imports: [HttpClientTestingModule]
  });

  return {
    renderResult,
    user,
    onPageChangedMockFn,
    onFiltersChangedMockFn,
    onClearFilters
  };
};

describe('PaymentsContainerComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the row data', async () => {
    await setup({ data: MOCK_PAGINATED_PAYMENTS });

    screen.getByText(MOCK_PAGINATED_PAYMENTS.items[0].id);
  });

  it('calls the filters changed method correctly', async () => {
    const { user, onFiltersChangedMockFn } = await setup({});

    await user.click(screen.getByLabelText('Status'));

    await user.click(screen.getByRole('option', { name: 'Completed' }));

    jest.runOnlyPendingTimers();

    expect(onFiltersChangedMockFn).toHaveBeenCalledWith({
      createdAtEnd: null,
      createdAtStart: null,
      status: PaymentTransactionStatus.Completed
    });
  });

  it('does not render the clear button when there are no filters set', async () => {
    await setup({});

    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('renders the clear button when there are filters set', async () => {
    await setup({ hasFilters: true });

    screen.getByRole('button', { name: 'Clear' });
  });

  it('calls the clear filters method when clicked', async () => {
    const { user, onClearFilters } = await setup({ hasFilters: true });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('calls the page changed method when clicked', async () => {
    const { user, onPageChangedMockFn } = await setup({ data: MOCK_PAGINATED_PAYMENTS });

    await user.click(screen.getByLabelText('Next page'));

    expect(onPageChangedMockFn).toHaveBeenCalledTimes(1);
  });

  it('displays no rows message when there is no data', async () => {
    await setup({ data: { ...MOCK_PAGINATED_PAYMENTS, items: [] } });

    screen.getByText('No transactions found');
  });

  it('does not display no rows message when there is data', async () => {
    await setup({ data: MOCK_PAGINATED_PAYMENTS });

    expect(screen.queryByText('No transactions found')).toBeNull();
  });

  it('renders the progress bar when loading data', async () => {
    await setup({ loading: true });

    screen.getByTestId('progress-bar');
  });

  it('does not render the progress bar when not loading', async () => {
    await setup({ loading: false });

    expect(screen.queryByTestId('progress-bar')).toBeNull();
  });
});
