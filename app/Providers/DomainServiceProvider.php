<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\RecordPolicyMappings;
use App\Bootstrap\Contracts\Domains\DomainAvailability as DomainAvailabilityContract;
use App\Bootstrap\DomainAvailability;
use App\Bootstrap\DomainSwitches;
use App\Bootstrap\Psr4ClassNames;
use App\Bus\Contracts\PipelineRunner;
use App\CommandRules\CommandRuleRegistry;
use App\CoreCommands;
use App\CoreMcpTools;
use App\Mcp\Support\McpCatalogue;
use App\Reflection\Contracts\ReflectorFactory;
use App\Search\SearchablesRegistry;
use App\Search\SearchDiagnostics;
use App\Settings\CoreSettings;
use App\Settings\EmptySettingsDefinition;
use App\Settings\SettingRegistry;
use App\Skills\ConditionRegistry;
use App\Skills\CoreSkills;
use App\Skills\SkillRegistry;
use App\Support\ClientDeclarations;
use App\Support\CommandRegistry;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\Rules\CoreRules;
use App\Web\Creation\DeclaredSurfaceCheck;
use App\Web\Creation\PageFactory;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Creation\WindowFactory;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Migrations\Migrator;
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
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);
        $this->app->singleton(PageFactory::class);
        $this->app->singleton(SurfaceAttributeMap::class);
        $this->app->singleton(WindowFactory::class);
        $this->app->booting(function () use ($registry): void {
            $this->registerDomainProviders($registry);
            $this->app->make(DeclaredSurfaceCheck::class)->registerDeclarations(
                $this->app->make(ClientDeclarations::class),
                $this->app->make(SurfaceAttributeMap::class),
            );
        });
        $this->keepMigrationsOfUnbootedDomains($registry);

        $this->app->singleton(
            CommandRegistry::class,
            fn (Application $app) => $registry->commandDeclarations(
                CoreCommands::owner(),
                $app->make(PipelineRunner::class),
            ),
        );

        $this->app->singleton(
            McpCatalogue::class,
            fn (Application $app) => $this->mcpCatalogue($registry, $app->make(CommandRegistry::class)),
        );

        $this->app->singleton(
            CommandRuleRegistry::class,
            fn () => $registry->commandRules(new CoreRules()->all()),
        );

        $this->app->singleton(
            SkillRegistry::class,
            fn () => SkillRegistry::of($registry->skillDeclarations(CoreSkills::owner())),
        );

        $this->app->singleton(
            ConditionRegistry::class,
            fn () => ConditionRegistry::of($registry->skillConditionDeclarations()),
        );

        $this->app->singleton(DomainSwitches::class, fn () => $registry->domainSwitches());

        $this->app->singleton(
            SettingRegistry::class,
            fn () => $this->settingRegistry($registry, $this->app->make(DomainSwitches::class)),
        );

        $this->app->scoped(DomainAvailabilityContract::class, DomainAvailability::class);

        $this->app->singleton(
            SearchablesRegistry::class,
            fn () => SearchablesRegistry::publishing($registry->searchableDeclarations()),
        );

        $this->app->bind(
            SearchDiagnostics::class,
            fn (Application $app) => new SearchDiagnostics($app->make('log')->channel('search')),
        );

        $classNames = Psr4ClassNames::fromComposer();

        DiscoverEvents::guessClassNamesUsing(
            fn (SplFileInfo $file, string $basePath) => $classNames->classOf((string) $file->getRealPath()),
        );
    }

    /**
     * The domains' policies are registered during boot like Core's; once every provider has booted, the command and
     * settings registries, the MCP catalogue, the searchables and the record policy mappings are checked, so a
     * declaration the application cannot start with fails the boot whichever provider registered its policy.
     */
    public function boot(
        DomainRegistry $registry,
        PolicyCatalogue $policies,
    ): void {
        foreach ($registry->all() as $entry) {
            foreach ($entry->policies() as $policy) {
                $policies->register($entry->name, $policy);
            }

            // A domain's texts for agents sit in its own lang folder, under its name in snake case.
            $this->loadTranslationsFrom(dirname($entry->folder).'/lang', Str::snake($entry->name));
        }

        $this->app->booted(function (): void {
            $this->app->make(CommandRegistry::class);
            $this->app->make(SettingRegistry::class);
            $this->app->make(McpCatalogue::class);
            $this->app->make(SearchablesRegistry::class);
            $this->app->make(RecordPolicyMappings::class)->assertResolved();
            $this->app->forgetScopedInstances();
        });

        foreach ($registry->all() as $entry) {
            $entry->boot($this->app);
        }
    }

    /**
     * @return list<string>
     */
    protected function domainClasses(): array
    {
        return DomainRegistry::bootedClasses($this->app->basePath());
    }

    /**
     * Each booted domain's own service providers, registered once every core provider is, so they boot after this
     * provider put the domains' models in the morph map; a domain that does not boot registers none.
     */
    private function registerDomainProviders(DomainRegistry $registry): void
    {
        foreach ($registry->all() as $entry) {
            foreach ($entry->providers() as $provider) {
                $this->app->register($provider);
            }
        }
    }

    /**
     * The schema stays whole whichever domains boot: an installed domain that does not boot still adds its migrations,
     * so every process of a test run shares one database shape.
     */
    private function keepMigrationsOfUnbootedDomains(DomainRegistry $registry): void
    {
        $booted = array_map(fn (DomainEntry $entry) => $entry->domain::class, $registry->all());
        $unbooted = array_diff(DomainRegistry::installedClasses($this->app->basePath()), $booted);

        // A domain that does not boot is never loaded: its package folder is named for it.
        foreach ($unbooted as $class) {
            $folder = $this->app->basePath('domain/'.DomainEntry::nameOf($class).'/database/migrations');
            $this->app->afterResolving('migrator', fn (Migrator $migrator) => $migrator->path($folder));
        }
    }

    /**
     * Core's MCP tools and resources first, then each domain's in bootstrap/domains.php order.
     */
    private function mcpCatalogue(DomainRegistry $registry, CommandRegistry $commands): McpCatalogue
    {
        $catalogue = new McpCatalogue($commands, $this->app->make(ReflectorFactory::class), $this->app);
        CoreMcpTools::registerIn($catalogue);
        $registry->registerMcpToolsIn($catalogue);

        return $catalogue;
    }

    private function settingRegistry(DomainRegistry $registry, DomainSwitches $switches): SettingRegistry
    {
        $settings = $registry->settingDeclarations(new CoreSettings($switches->groups()));

        foreach ($settings->definitions() as $definition) {
            if (! $definition instanceof EmptySettingsDefinition) {
                $this->app->instance($definition::class, $definition);
            }
        }

        return $settings;
    }
}
