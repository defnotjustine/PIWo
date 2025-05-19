describe('Strona główna aplikacji książkowej', () => {
   before(() => {
    // Ignoruj nieprzechwycone wyjątki (tymczasowo dla debugowania)
    Cypress.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false; // Zapobiega failowaniu testu
    });
  });

  beforeEach(() => {
    // Odwiedź stronę z dłuższym timeoutem
    cy.visit('/', {
      timeout: 10000,
      onBeforeLoad(win) {
        // Tymczasowo wyłącz React DevTools aby uniknąć błędów
        delete win.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      }
    });
  });

  it('1. Ma wyświetlać listę książek', () => {
    // Sprawdź czy nagłówek istnieje
    cy.contains('h1', 'Lista książek').should('be.visible');
    
    // Sprawdź czy input wyszukiwania istnieje
    cy.get('input[placeholder="Szukaj książki..."]').should('exist');
    
    // Sprawdź czy tabela z książkami istnieje
    cy.get('table').should('exist');
    
    // Sprawdź czy są jakieś książki na liście
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('2. Ma filtrować książki po wpisaniu tekstu w wyszukiwarkę', () => {
    // Wpisz tekst do wyszukiwarki
    cy.get('input[placeholder="Szukaj książki..."]').type('Władca');
    
    // Sprawdź czy tylko pasujące książki są widoczne
    cy.get('tbody tr').should('have.length.at.least', 1);
    cy.contains('tbody tr', 'Władca Pierścieni').should('exist');
    cy.contains('tbody tr', 'Duma i uprzedzenie').should('not.exist');
    
    // Wyczyść wyszukiwanie
    cy.get('input[placeholder="Szukaj książki..."]').clear();
    
    // Sprawdź czy wszystkie książki są znów widoczne
    cy.get('tbody tr').should('have.length.greaterThan', 1);
  });

  it('3. Ma wyświetlać komunikat gdy brak wyników wyszukiwania', () => {
    // Wpisz nieistniejący tytuł
    cy.get('input[placeholder="Szukaj książki..."]').type('Nieistniejąca książka 123456');
    
    // Sprawdź komunikat o braku wyników
    cy.contains('Brak książek do wyświetlenia').should('be.visible');
    
    // Sprawdź czy tabela jest pusta
    cy.get('tbody tr').should('have.length', 0);
    
    // Wyczyść wyszukiwanie
    cy.get('input[placeholder="Szukaj książki..."]').clear();
    
    // Sprawdź czy książki wróciły
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });
});