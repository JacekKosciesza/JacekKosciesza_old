import { JacekKoscieszaPage } from './app.po';

describe('jacek-kosciesza App', function() {
  let page: JacekKoscieszaPage;

  beforeEach(() => {
    page = new JacekKoscieszaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
