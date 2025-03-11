// test/amm.service.test.ts
import { AMMService } from './amm.service';

// Mock window.midnight.mnLace
const mockState = jest.fn().mockResolvedValue({
  address: 'baeb8ea7...797e1ab|03003753...646194',
  did: 'did:midnight:test',
  networkId: 'testnet',
  kycLevel: 2
});

const mockApi = {
  state: mockState,
  balanceAndProveTransaction: jest.fn(),
  proveTransaction: jest.fn(),
  balanceTransaction: jest.fn(),
  submitTransaction: jest.fn()
};

const mockEnable = jest.fn().mockResolvedValue(mockApi);

global.window = {
  midnight: {
    mnLace: {
      enable: mockEnable,
      isEnabled: jest.fn().mockReturnValue(true)
    }
  }
} as any;

describe('AMMService', () => {
  let amm: AMMService;

  beforeEach(() => {
    amm = new AMMService();
    jest.clearAllMocks();
  });

  test('initial pool state is valid', () => {
    expect(amm['pool'].tDust * amm['pool'].loanTokens).toBe(1000);
  });

  test('deposit increases pool', async () => {
    await amm.deposit(200);
    expect(amm['pool'].tDust).toBe(1200);
    expect(amm['pool'].totalDeposits).toBe(1200);
    expect(mockEnable).toHaveBeenCalled();
    expect(mockState).toHaveBeenCalled();
  });

  test('borrow reduces pool with fee', async () => {
    await amm.borrow();
    expect(amm['pool'].tDust).toBe(898); // 1000 - 100 - 2 fee
    expect(amm['pool'].loanTokens).toBeCloseTo(1.112, 3); // k/898
    expect(amm['pool'].lossPool).toBe(1); // 1 tDust to Loss Pool
  });

  test('repay increases pool with interest', async () => {
    await amm.borrow();
    await amm.repay(10); // First of 11 payments
    expect(amm['pool'].tDust).toBe(908); // 898 + 10
    expect(amm['pool'].loanTokens).toBeCloseTo(1.101, 3); // k/908
  });

  test('handle default uses Loss Pool', async () => {
    await amm.borrow();
    await amm.handleDefault();
    expect(amm['pool'].lossPool).toBe(-89); // 1 - 90
  });

  test('fails when wallet is not connected', async () => {
    mockEnable.mockResolvedValueOnce(null);
    await expect(amm.deposit(200)).rejects.toThrow('Wallet not connected');
  });

  test('fails when KYC level is insufficient', async () => {
    mockState.mockResolvedValueOnce({
      ...await mockState(),
      kycLevel: 0
    });
    await expect(amm.deposit(200)).rejects.toThrow('KYC verification required');
  });
});