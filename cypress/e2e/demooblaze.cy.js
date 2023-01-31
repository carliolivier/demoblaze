import { faker } from "@faker-js/faker";

let name = faker.name.fullName();
let country = faker.address.country();
let city = faker.address.city();
let username = faker.internet.userName();
let numberCB = faker.finance.creditCardNumber();
let month = faker.date.month();


let mdpunique = newMDP();
function newMDP() {
	let charset =
		"0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let MDPLength = 8;
	let MDP = "";
	for (var i = 0; i <= MDPLength; i++) {
		var randomNumber = Math.floor(Math.random() * charset.length);
		MDP += charset.substring(randomNumber, randomNumber + 1);
	}
	return MDP;
}

describe("Demoblaze ", () => {
	beforeEach(() => {
		cy.visit("https://www.demoblaze.com/");
	});

	it("crée un utilisateur", () => {
		cy.get("#signin2").should("be.visible").click();
		cy.wait(1000);
		cy.get("#sign-username").should("be.visible").type(username);
		cy.get("#sign-password").should("be.visible").type(mdpunique);
		cy.get("#signInModal").find(".btn-primary").click();
	});
	it("connection d'un utilisateur", () => {
		cy.get("#login2").should("be.visible").click();
		cy.wait(1000);
		cy.get("#loginusername").should("be.visible").type("ratitas");
		cy.get("#loginpassword").should("be.visible").type("1234Abcd");
		cy.get("#logInModal").find(".btn-primary").click();
	});
	it("ajouter produit au panier et confirmation et payement de l'article", () => {
		cy.intercept({
			method: "POST",
			url: "**/deletecart",
		}).as("purchaseOrder");
		cy.get("#login2").click();
		cy.wait(1000);
		cy.get("#loginusername").type("ratitas");
		cy.get("#loginpassword").type("1234Abcd");
		cy.get(
			"#logInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
		).click();
		cy.wait(1000);
		cy.get(":nth-child(4) > .card > :nth-child(1) > .card-img-top").click();
		cy.get(".col-sm-12 > .btn").click();
		cy.get("#cartur").click();
		cy.get(".col-lg-1 > .btn").click();
		cy.wait(1000);
		cy.get("#name").type(name);
		cy.get("#country").type(country);
		cy.get("#city").type(city);
		cy.get("#card").type(numberCB);
		cy.get("#month").type(month);
		cy.get("#year").type("2025");
		cy.get("#orderModal").find(".btn-primary").click();
		cy.wait("@purchaseOrder").then(interception => {
			expect(interception.response.statusCode).eq(200);
			expect(interception.response.body).eq("Item deleted.");
		});
		cy.contains("OK").click();
		// cy.url().should("include", "index.html");
	});
});
