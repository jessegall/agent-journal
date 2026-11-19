<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\PropertyRules;
use App\Contracts\DomainAvailability;
use App\CoreApi;
use App\CoreCommands;
use App\CoreMcpTools;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\DomainSwitches;
use App\Domains\Support\Exports as ExportsCheck;
use App\Domains\Support\Psr4ClassNames;
use App\Domains\Support\SettingsDomainAvailability;
use App\Mcp\Support\McpCatalogue;
use App\Processes\Rules\CoreRules;
use App\Processes\Support\CommandRuleRegistry;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\EmptySettingsDefinition;
use App\Settings\Support\SettingRegistry;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Skills\Support\ConditionRegistry;
use App\Skills\Support\CoreSkills;
use App\Skills\Support\SkillRegistry;
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
        ExportsCheck::check('Core', Str::beforeLast(CoreApi::class, '\\'), CoreApi::exports());
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);
        $this->app->singleton(
            CommandRegistry::class,
            fn (Application $app) => $registry->commandDeclarations(
                CoreCommands::owner(),
                $app->make(PropertyRules::class),
            ),
        );
        $this->app->singleton(McpCatalogue::class, fn () => $this->mcpCatalogue($registry));
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

        $classNames = Psr4ClassNames::fromComposer();
        DiscoverEvents::guessClassNamesUsing(
            fn (SplFileInfo $file, string $basePath) => $classNames->classOf((string) $file->getRealPath()),
        );
    }

    /**
     * Policies are registered first, since command declarations are checked against them; asking for the command and
     * settings registries and the MCP catalogue here makes a declaration the application cannot start with fail the
     * boot.
     */
    public function boot(
        DomainRegistry $registry,
        PolicyCatalogue $policies,
        ShareRecordRegistry $shareRecords,
        ShareGatewayRegistry $shareGateways,
    ): void {
        foreach ($registry->all() as $entry) {
            foreach ($entry->policies() as $policy) {
                $policies->register($entry->name, $policy);
            }
        }
        $this->app->make(CommandRegistry::class);
        $this->app->make(SettingRegistry::class);
        $this->app->make(McpCatalogue::class);
        foreach ($registry->all() as $entry) {
            foreach ($entry->shareRecords() as $registration) {
                $shareRecords->register($registration);
            }
            foreach ($entry->shareGateways() as $key => $gatewayClass) {
                $shareGateways->register($key, $gatewayClass);
            }
        }
        foreach ($registry->all() as $entry) {
            $entry->boot($this->app);
        }
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
    private function mcpCatalogue(DomainRegistry $registry): McpCatalogue
    {
        $catalogue = new McpCatalogue();
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
