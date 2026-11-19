<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\PropertyRules;
use App\CoreCommands;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Numbers\Support\NumberedTypeRegistry;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Ledger\LedgerDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Support\CommandTrail;

/**
 * Installs the Cards and Notes test modules on the command bus, optionally with extra middleware on Notes, as a
 * deploy would: the registry rebuilt from the domains and the request's bus built afresh.
 */
trait InstallsCommandModules
{
    protected function installCommandModules(MiddlewareDeclaration ...$extraNotesMiddleware): CommandTrail
    {
        return $this->installCommandModulesRequiring([], ...$extraNotesMiddleware);
    }

    /**
     * The test modules with Notes also requiring the named owners, as a test middleware that names another owner's
     * exported command needs.
     *
     * @param  list<string>  $alsoRequired  owner names, such as Plans
     */
    protected function installCommandModulesRequiring(
        array $alsoRequired,
        MiddlewareDeclaration ...$extraNotesMiddleware,
    ): CommandTrail {
        $this->installCommandRegistry($alsoRequired, ...$extraNotesMiddleware);

        if (! Schema::hasTable('module_command_rows')) {
            Schema::create('module_command_rows', function (Blueprint $table): void {
                $table->id();
                $table->string('text');
            });
        }

        return $this->app->make(CommandTrail::class);
    }

    /**
     * The command registry with the test modules, and nothing in the database.
     *
     * @param  list<string>  $alsoRequired
     */
    protected function installCommandRegistry(
        array $alsoRequired = [],
        MiddlewareDeclaration ...$extraNotesMiddleware,
    ): void {
        $domains = $this->domainsWith(CardsDomain::class, LedgerDomain::class, NotesDomain::class);
        $this->app->instance(DomainRegistry::class, $domains);
        $owners = array_map(fn (DomainEntry $entry) => $entry->commandOwner(), $domains->all());
        $owners = array_map(fn (CommandOwner $owner) => $owner->domainClass === NotesDomain::class
            ? new CommandOwner(
                $owner->name,
                $owner->namespace,
                $owner->domainClass,
                $owner->commands,
                [...$owner->middleware, ...$extraNotesMiddleware],
                [...$owner->requires, ...$alsoRequired],
                $owner->exports,
            )
            : $owner, $owners);

        $this->app->instance(CommandRegistry::class, CommandRegistry::from(
            [CoreCommands::owner(), ...$owners],
            $this->app->make(PropertyRules::class),
        ));
        $this->registerPoliciesOf($domains, [CardsDomain::class, LedgerDomain::class, NotesDomain::class]);
        $this->app->forgetScopedInstances();
    }

    /**
     * Registers the test modules' policies as the application's boot does, so their commands' declarations can be
     * granted; the domains the application booted, and an earlier install, registered theirs already.
     *
     * @param  list<class-string>  $moduleClasses
     */
    private function registerPoliciesOf(DomainRegistry $domains, array $moduleClasses): void
    {
        $catalogue = $this->app->make(PolicyCatalogue::class);
        $registered = array_map(fn (PolicyRegistration $policy) => $policy->policy, $catalogue->grantable());

        if (! in_array(FixturePolicy::class, $registered, true)) {
            $catalogue->register(
                'Core',
                new PolicyRegistration(FixtureWork::class, FixturePolicy::class, FixtureAbility::class),
            );
        }

        foreach ($domains->all() as $entry) {
            if (! in_array($entry->className(), $moduleClasses, true)) {
                continue;
            }

            foreach ($entry->policies() as $policy) {
                if (in_array($policy->policy, $registered, true)) {
                    continue;
                }

                $catalogue->register($entry->name, $policy);
            }
        }
    }

    /**
     * Boots test modules beside the domains of bootstrap/domains.php, as the application boots a domain: the command
     * registry with their commands, then each module's own bootstrappers, then the numbered models checked.
     *
     * @param  class-string  ...$moduleClasses
     */
    protected function bootModules(string ...$moduleClasses): void
    {
        $domains = $this->domainsWith(...$moduleClasses);
        $this->app->instance(DomainRegistry::class, $domains);
        $this->app->instance(CommandRegistry::class, $domains->commandDeclarations(
            CoreCommands::owner(),
            $this->app->make(PropertyRules::class),
        ));

        foreach ($moduleClasses as $moduleClass) {
            DomainEntry::fromClass($moduleClass)->boot($this->app);
        }

        $this->app->make(NumberedTypeRegistry::class)->checkDeclarations();
        $this->app->forgetScopedInstances();
    }

    /**
     * @param  class-string  ...$moduleClasses
     */
    private function domainsWith(string ...$moduleClasses): DomainRegistry
    {
        $domains = DomainRegistry::installedClasses(base_path());

        return DomainRegistry::from([...$domains, ...$moduleClasses]);
    }
}
