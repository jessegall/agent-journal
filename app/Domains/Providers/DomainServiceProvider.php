<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\Bus\Support\CommandRegistry;
use App\CoreApi;
use App\CoreCommands;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\Exports as ExportsCheck;
use App\Domains\Support\Psr4ClassNames;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\EmptySettingsDefinition;
use App\Settings\Support\SettingRegistry;
use Illuminate\Foundation\Events\DiscoverEvents;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use SplFileInfo;

/**
 * Registers the domains of bootstrap/domains.php, their registry and the commands and settings they declare, and boots
 * each domain by running the bootstrappers it lists. Each settings definition is bound as the very object registered,
 * so injecting it gives the handles the settings registry knows.
 */
class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        ExportsCheck::check('Core', Str::beforeLast(CoreApi::class, '\\'), CoreApi::exports());
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);
        $this->app->singleton(CommandRegistry::class, fn () => $registry->commandDeclarations(CoreCommands::owner()));
        $this->app->singleton(SettingRegistry::class, fn () => $this->settingRegistry($registry));

        $classNames = Psr4ClassNames::fromComposer();
        DiscoverEvents::guessClassNamesUsing(fn (SplFileInfo $file, string $basePath) => $classNames->classOf((string) $file->getRealPath()));
    }

    /**
     * Asking for the command and settings registries here makes a declaration the application cannot start with fail
     * the boot.
     */
    public function boot(DomainRegistry $registry, CommandRegistry $commands, SettingRegistry $settings): void
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

    private function settingRegistry(DomainRegistry $registry): SettingRegistry
    {
        $settings = $registry->settingDeclarations(new CoreSettings);

        foreach ($settings->definitions() as $definition) {
            if (! $definition instanceof EmptySettingsDefinition) {
                $this->app->instance($definition::class, $definition);
            }
        }

        return $settings;
    }
}
