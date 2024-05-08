import '@testing-library/jest-dom';
import 'jest-preset-angular/setup-jest';

jest.mock('@env/environment', () => ({
  environment: {
    api: 'api'
  }
}));
