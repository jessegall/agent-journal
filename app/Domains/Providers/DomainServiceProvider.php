<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\Bus\Support\CommandRegistry;
use App\CoreApi;
use App\CoreCommands;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\Exports as ExportsCheck;
use App\Domains\Support\Psr4ClassNames;
use Illuminate\Foundation\Events\DiscoverEvents;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use SplFileInfo;

/**
 * Registers the domains of bootstrap/domains.php and their registry, and boots each domain by running
 * the bootstrappers it lists.
 */
class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        ExportsCheck::check('Core', Str::beforeLast(CoreApi::class, '\\'), CoreApi::exports());
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);
        $this->app->singleton(CommandRegistry::class, fn () => $registry->commandDeclarations(CoreCommands::owner()));

        $classNames = Psr4ClassNames::fromComposer();
        DiscoverEvents::guessClassNamesUsing(fn (SplFileInfo $file, string $basePath) => $classNames->classOf((string) $file->getRealPath()));
    }

    /**
     * Asking for the command registry here makes a command declaration the application cannot start with fail the boot.
     */
    public function boot(DomainRegistry $registry, CommandRegistry $commands): void
    {
        foreach ($registry->all() as $entry) {
            $entry->boot($this->app);
        }
    }

    /**
     * @return list<string>
     */
    protected function domainClasses(): array
    {
        return require $this->app->basePath('bootstrap/domains.php');
    }
}
