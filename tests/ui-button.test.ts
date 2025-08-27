import { getButtonClasses } from '../src/ui/button';

describe('UI Button class composition', () => {
  it('defaults to icon + md size', () => {
    const cls = getButtonClasses();
    expect(cls).toContain('md-icon-button');
    expect(cls).toContain('px-3');
  });

  it('outlined variant uses MD2 outline styles', () => {
    const cls = getButtonClasses({ variant: 'outlined', size: 'sm' });
    expect(cls).toContain('md2-btn-outlined');
    expect(cls).toContain('md2-size-sm');
  });

  it('contained variant uses MD2 contained styles', () => {
    const cls = getButtonClasses({ variant: 'contained', size: 'lg' });
    expect(cls).toContain('md2-btn-contained');
    expect(cls).toContain('md2-size-lg');
  });

  it('text variant uses primary color', () => {
    const cls = getButtonClasses({ variant: 'text' });
    expect(cls).toContain('md2-btn-text');
  });

  it('merges extra classes', () => {
    const cls = getButtonClasses({ extraClassName: 'custom' });
    expect(cls).toContain('custom');
  });
});


