<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\MiddlewareDeclaration;
use App\CoreCommands;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Support\NumberedTypeRegistry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
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
    protected function installCommandModulesRequiring(array $alsoRequired, MiddlewareDeclaration ...$extraNotesMiddleware): CommandTrail
    {
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
     */
    /**
     * @param  list<string>  $alsoRequired
     */
    protected function installCommandRegistry(array $alsoRequired = [], MiddlewareDeclaration ...$extraNotesMiddleware): void
    {
        $owners = array_map(fn (DomainEntry $entry) => $entry->commandOwner(), $this->domainsWith(CardsDomain::class, LedgerDomain::class, NotesDomain::class)->all());
        $owners = array_map(fn (CommandOwner $owner) => $owner->domainClass === NotesDomain::class
            ? new CommandOwner($owner->name, $owner->namespace, $owner->domainClass, $owner->commands, [...$owner->middleware, ...$extraNotesMiddleware], [...$owner->requires, ...$alsoRequired], $owner->exports)
            : $owner, $owners);

        $this->app->instance(CommandRegistry::class, CommandRegistry::from([CoreCommands::owner(), ...$owners]));
        $this->app->forgetScopedInstances();
    }

    /**
     * Installs test modules beside the domains of bootstrap/domains.php, as the application would boot them: their
     * commands, the link types of their models, and their numbered models, checked.
     *
     * @param  array<string, class-string<Model>>  $linkTypes
     * @param  class-string  ...$domainClasses
     */
    protected function installModules(array $linkTypes, string ...$domainClasses): void
    {
        $this->app->instance(CommandRegistry::class, $this->domainsWith(...$domainClasses)->commandDeclarations(CoreCommands::owner()));
        $this->app->make(LinkTypeRegistry::class)->register($linkTypes);
        $numbered = $this->app->make(NumberedTypeRegistry::class);

        foreach ($domainClasses as $domainClass) {
            $numbered->register(...DomainEntry::fromClass($domainClass)->numberedModels());
        }

        $numbered->checkDeclarations();
        $this->app->forgetScopedInstances();
    }

    /**
     * @param  class-string  ...$moduleClasses
     */
    private function domainsWith(string ...$moduleClasses): DomainRegistry
    {
        /** @var list<class-string> $domains */
        $domains = require base_path('bootstrap/domains.php');

        return DomainRegistry::from([...$domains, ...$moduleClasses]);
    }
}
