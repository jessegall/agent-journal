<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\Assignments\Contracts\AssignmentRegistration;
use App\Bus\Support\CommandRegistry;
use App\CoreCommands;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\Psr4ClassNames;
use App\Hooks\Events\StateTypesRequested;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Events\DiscoverEvents;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\ServiceProvider;
use SplFileInfo;

/**
 * Registers the domains of bootstrap/domains.php: their registry, listener folders, migrations and the states they declare.
 */
class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);
        $this->app->singleton(CommandRegistry::class, fn () => $registry->commandDeclarations(CoreCommands::owner()));

        EventServiceProvider::addEventDiscoveryPaths($registry->listenerFolders());

        $classNames = Psr4ClassNames::fromComposer();
        DiscoverEvents::guessClassNamesUsing(fn (SplFileInfo $file, string $basePath) => $classNames->classOf((string) $file->getRealPath()));
    }

    /**
     * Asking for the command registry here makes a command declaration the application cannot start with fail the boot.
     */
    public function boot(DomainRegistry $registry, Dispatcher $events, AssignmentRegistration $assignments, CommandRegistry $commands): void
    {
        foreach ($registry->all() as $entry) {
            $this->loadMigrationsFrom($entry->migrationFolder());
        }

        $events->listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $registry->registerStatesIn($event->registry, $this->app));
        $registry->registerAssignmentsIn($assignments);
    }

    /**
     * @return list<string>
     */
    protected function domainClasses(): array
    {
        return require $this->app->basePath('bootstrap/domains.php');
    }
}
