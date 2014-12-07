var assert = require("should");
var vm = require("../lib/versionmanager");

describe('Version manager', function () {
    //before(function(){
    //    vm.initialize();
    //});

    describe('upgradeDependencyDeclaration', function () {
        it('numeric upgrades', function () {
            vm.upgradeDependencyDeclaration("0", "1").should.equal("1");
            vm.upgradeDependencyDeclaration("1", "10").should.equal("10");
            vm.upgradeDependencyDeclaration("10", "1").should.equal("1"); // Downgrade

            vm.upgradeDependencyDeclaration("0.1", "1.0").should.equal("1.0");
            vm.upgradeDependencyDeclaration("1.0", "1.1").should.equal("1.1");
            vm.upgradeDependencyDeclaration("2.0", "1.1").should.equal("1.1"); // Downgrade

            vm.upgradeDependencyDeclaration("1.0.0", "1.0.1").should.equal("1.0.1");
            vm.upgradeDependencyDeclaration("1.0.1", "1.1.0").should.equal("1.1.0");
            vm.upgradeDependencyDeclaration("2.0.1", "2.0.11").should.equal("2.0.11");
            vm.upgradeDependencyDeclaration("2.0.0", "1.0.0").should.equal("1.0.0"); // Downgrade

            vm.upgradeDependencyDeclaration("1.0.0", "1.1").should.equal("1.1");
            vm.upgradeDependencyDeclaration("1.0.0", "2").should.equal("2");
            vm.upgradeDependencyDeclaration("22.0.1", "22").should.equal("22"); // Downgrade
        });

        it('wildcard upgrades', function () {
            vm.upgradeDependencyDeclaration("1.x", "1.1").should.equal("1.x");
            vm.upgradeDependencyDeclaration("1.x.1", "1.1.2").should.equal("1.x.2");
            vm.upgradeDependencyDeclaration("1.0.x", "1.1.1").should.equal("1.1.x");
            vm.upgradeDependencyDeclaration("1.0.x", "1.1").should.equal("1.1");
            vm.upgradeDependencyDeclaration("1.0.x", "2").should.equal("2");
            vm.upgradeDependencyDeclaration("2.0.x", "1.0.0").should.equal("1.0.x"); // Downgrade

            vm.upgradeDependencyDeclaration("*", "1").should.equal("*");
            vm.upgradeDependencyDeclaration("*", "1.1").should.equal("*");
            vm.upgradeDependencyDeclaration("*.1", "2.0.1").should.equal("*.0");
        });

        it('constrained numeric upgrades', function () {
            vm.upgradeDependencyDeclaration("<1.0", "1.1").should.equal("<1.1");
            vm.upgradeDependencyDeclaration("<1.0", "1.1.1").should.equal("<1.1");
            vm.upgradeDependencyDeclaration(">=1.0", "2.0").should.equal(">=2.0");
            vm.upgradeDependencyDeclaration(">= 1.0", "2.0").should.equal(">= 2.0");
            vm.upgradeDependencyDeclaration("^1.2.3", "1.2.4").should.equal("^1.2.4");
        });

        it('maintain "unclean" semantic versions', function () {
            vm.upgradeDependencyDeclaration("v1.0", "1.1").should.equal("v1.1");
            vm.upgradeDependencyDeclaration("=v1.0", "1.1").should.equal("=v1.1");
            vm.upgradeDependencyDeclaration(" =v1.0", "1.1").should.equal(" =v1.1");
        });
    });
});
