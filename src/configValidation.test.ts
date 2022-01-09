import { setDefaults } from "./configDefaults";
import { validate } from "./configValidation";

describe('validate', () => {
  it('must check that both TLS options are set', () => {
    validate(setDefaults({
      tlsCertificateFile: 'foo',
      tlsCertificateKeyFile: 'bar'
    }));
  });

  it('must fail when either is missing', () => {
    expect(() => validate(setDefaults({
      tlsCertificateKeyFile: 'bar'
    }))).toThrow();

    expect(() => validate(setDefaults({
      tlsCertificateFile: 'foo',
    }))).toThrow();
  });
});
