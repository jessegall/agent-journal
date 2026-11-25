<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Bus\PipelineRunner;
use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Reflection\ReflectorFactory;
use App\Contracts\Sharing\SharePolicy;
use App\Contracts\Sharing\ShareStatusResolver;
use App\CoreCommands;
use App\CoreMcpTools;
use App\Mcp\Support\McpCatalogue;
use App\Support\CommandRegistry;
use App\Support\CommandRuleRegistry;
use App\Support\ConditionRegistry;
use App\Support\CoreSettings;
use App\Support\CoreSkills;
use App\Support\DomainRegistry;
use App\Support\DomainSwitches;
use App\Support\EmptySettingsDefinition;
use App\Support\NoSharePolicy;
use App\Support\NothingShared;
use App\Support\Psr4ClassNames;
use App\Support\RecordPolicyMappings;
use App\Support\Rules\CoreRules;
use App\Support\SearchablesRegistry;
use App\Support\SearchDiagnostics;
use App\Support\SettingRegistry;
use App\Support\SettingsDomainAvailability;
use App\Support\ShareRecordRegistry;
use App\Support\SkillRegistry;
use Illuminate\Contracts\Foundation\Application;
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
        $this->app->singleton(ShareRecordRegistry::class);
        $this->app->bindIf(ShareStatusResolver::class, NothingShared::class);
        $this->app->bindIf(SharePolicy::class, NoSharePolicy::class);

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
            fn (): CommandRuleRegistry => $registry->commandRules(new CoreRules()->all()),
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

        $this->app->scoped(DomainAvailability::class, SettingsDomainAvailability::class);

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
        ShareRecordRegistry $shareRecords,
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

        // A domain's boot puts its models in the morph map, which its share records name by link type.
        foreach ($registry->all() as $entry) {
            $entry->boot($this->app);
        }

        foreach ($registry->all() as $entry) {
            foreach ($entry->shareRecords() as $registration) {
                $shareRecords->register($registration);
            }
        }

        $this->app->booted(fn () => $shareRecords->checkRelations());
    }

    /**
     * @return list<string>
     */
    protected function domainClasses(): array
    {
        return DomainRegistry::installedClasses($this->app->basePath());
    }

    /**
     * Core's MCP tools and resources first, then each domain's in bootstrap/domains.php order.
     */
    private function mcpCatalogue(DomainRegistry $registry, CommandRegistry $commands): McpCatalogue
    {
        $catalogue = new McpCatalogue($commands, $this->app->make(ReflectorFactory::class));
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
