<?php

declare(strict_types=1);

namespace App\Support;

use App\Bootstrap\DomainSwitches;
use App\Bootstrap\Exceptions\DomainNotFound;
use App\Bus\CheckedCommandRegistries;
use App\Bus\CommandOwner;
use App\Bus\Contracts\PipelineRunner;
use App\CommandRules\CommandRuleRegistry;
use App\Exceptions\AmbiguousDomainRoot;
use App\Exceptions\DomainCycle;
use App\Exceptions\DomainListedTwice;
use App\Exceptions\RequiredDomainMissing;
use App\Mcp\Contracts\McpRegistration;
use App\Navigation\Declarations\DomainClient;
use App\Settings\CoreSettings;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\SettingRegistry;
use App\Skills\Values\SkillConditionDefinition;
use App\Values\CommandRule;
use App\Values\SkillOwner;

/**
 * Every registered domain by name, checked once when the list is read and never changed after.
 */
final readonly class DomainRegistry
{
    /**
     * The environment value that names the domains a process boots, by class, separated by commas.
     */
    public const string BOOTED_DOMAINS = 'JOURNAL_BOOTED_DOMAINS';

    /**
     * @param  array<string, DomainEntry>  $domainsByName
     */
    private function __construct(private array $domainsByName) {}

    /**
     * @param  list<string>  $classNames
     */
    public static function from(array $classNames): self
    {
        $domainsByName = [];

        foreach ($classNames as $className) {
            $entry = DomainEntry::fromClass($className);

            if (array_key_exists($entry->name, $domainsByName)) {
                throw DomainListedTwice::for($entry->name);
            }

            foreach ($domainsByName as $earlier) {
                if ($earlier->overlaps($entry)) {
                    throw AmbiguousDomainRoot::between($earlier->name, $entry->name);
                }
            }

            $domainsByName[$entry->name] = $entry;
        }

        $listedClasses = array_map(fn (DomainEntry $entry) => $entry->className(), $domainsByName);

        foreach ($domainsByName as $entry) {
            foreach ($entry->requires as $requiredClass) {
                if (! in_array($requiredClass, $listedClasses, true)) {
                    throw RequiredDomainMissing::for($entry->name, DomainEntry::nameOf($requiredClass));
                }
            }
        }

        foreach ($domainsByName as $entry) {
            self::refuseCycleFrom($domainsByName, $entry, []);
        }

        foreach ($domainsByName as $entry) {
        }

        return new self($domainsByName);
    }

    /**
     * @return list<DomainEntry>
     */
    public function all(): array
    {
        return array_values($this->domainsByName);
    }

    public function has(string $name): bool
    {
        return array_key_exists($name, $this->domainsByName);
    }

    public function get(string $name): DomainEntry
    {
        return $this->domainsByName[$name] ?? throw DomainNotFound::for($name);
    }

    /**
     * The pages, navigation and sections every domain declares through PageProvider, NavigationProvider and
     * SectionProvider, checked together with Core's own; a domain that declares none of them adds nothing.
     */
    public function clientDeclarations(DomainClient ...$coreDeclarations): ClientDeclarations
    {
        return ClientDeclarations::check($this->clientOwners(...$coreDeclarations));
    }

    /** @return list<DomainClient> */
    public function clientOwners(DomainClient ...$coreDeclarations): array
    {
        $domainDeclarations = array_map(fn (DomainEntry $entry) => $entry->client(), $this->all());

        return [
            ...$coreDeclarations,
            ...$domainDeclarations,
        ];
    }

    /**
     * Every owner's commands and middleware, Core's first and then the domains in bootstrap/domains.php order, checked
     * together; start-up stops at the first wrong declaration.
     */
    public function commandDeclarations(CommandOwner $core, PipelineRunner $pipelines): CommandRegistry
    {
        $owners = [
            $core,
            ...array_map(fn (DomainEntry $entry) => $entry->commandOwner(), $this->all()),
        ];

        return CheckedCommandRegistries::for($owners, $pipelines);
    }

    /**
     * Every owner of skills, Core's first and then the domains in bootstrap/domains.php order.
     *
     * @return list<SkillOwner>
     */
    public function skillDeclarations(SkillOwner $core): array
    {
        return [
            $core,
            ...array_map(fn (DomainEntry $entry) => $entry->skillOwner(), $this->all()),
        ];
    }

    /**
     * Every domain's named skill condition types, by domain name, in bootstrap/domains.php order.
     *
     * @return array<string, list<SkillConditionDefinition>>
     */
    public function skillConditionDeclarations(): array
    {
        $byOwner = [];

        foreach ($this->all() as $entry) {
            $byOwner[$entry->name] = $entry->skillConditions();
        }

        return $byOwner;
    }

    /**
     * Every domain's searchables, by domain name, in bootstrap/domains.php order.
     *
     * @return array<string, list<SearchSource>>
     */
    public function searchableDeclarations(): array
    {
        $byOwner = [];

        foreach ($this->all() as $entry) {
            $byOwner[$entry->name] = $entry->searchables();
        }

        return $byOwner;
    }

    /**
     * Core's built-in command rules with every domain's own, which wait for review.
     *
     * @param  list<CommandRule>  $coreRules
     */
    public function commandRules(array $coreRules): CommandRuleRegistry
    {
        $domainRules = array_merge(
            ...array_map(fn (DomainEntry $entry) => $entry->commandRules(), $this->all()),
        );

        return CommandRuleRegistry::from([...$coreRules, ...$domainRules]);
    }

    /**
     * Adds every domain's MCP tools and resources to the registration, in bootstrap/domains.php order.
     */
    public function registerMcpToolsIn(McpRegistration $registration): void
    {
        foreach ($this->all() as $entry) {
            $entry->registerMcpToolsIn($registration);
        }
    }

    /**
     * Every owner's settings, Core's first and then the domains in bootstrap/domains.php order, checked together, with
     * one Core switch per domain keyed domain_<name>, on by default. Start-up stops at the first wrong declaration.
     *
     * @throws SettingDeclarationInvalid
     */
    public function domainSwitches(): DomainSwitches
    {
        $groups = [];

        foreach ($this->all() as $entry) {
            $groups[$entry->name] = ToggleGroup::make(
                'domain_'.strtolower($entry->name),
                $entry->name,
                true,
                [],
                'When off, its pages are hidden. Nothing is deleted.',
            );
        }

        return new DomainSwitches($groups);
    }

    public function settingDeclarations(CoreSettings $core): SettingRegistry
    {
        $definitions = [SettingRegistry::CORE => $core];

        foreach ($this->all() as $entry) {
            if (isset($definitions[$entry->name])) {
                throw SettingDeclarationInvalid::ownerTwice($entry->name);
            }

            $definitions[$entry->name] = $entry->settings;
        }

        return SettingRegistry::from($definitions);
    }

    /**
     * @return list<string>
     */
    public function listenerFolders(): array
    {
        return array_map(fn (DomainEntry $entry) => $entry->listenerFolder(), $this->all());
    }

    /**
     * Walks the required domains depth first and throws when the walk reaches a domain already on its path.
     *
     * @param  array<string, DomainEntry>  $domainsByName
     * @param  list<string>  $path
     */
    private static function refuseCycleFrom(array $domainsByName, DomainEntry $entry, array $path): void
    {
        $position = array_search($entry->name, $path, true);

        if ($position !== false) {
            throw DomainCycle::for([...array_slice($path, $position), $entry->name]);
        }

        foreach ($entry->requires as $requiredClass) {
            self::refuseCycleFrom(
                $domainsByName,
                $domainsByName[DomainEntry::nameOf($requiredClass)],
                [...$path, $entry->name],
            );
        }
    }

    /**
     * The domain classes the project installs, in the order bootstrap/domains.php lists them.
     *
     * @return list<class-string<Domain>>
     */
    public static function installedClasses(string $basePath): array
    {
        return require $basePath.'/bootstrap/domains.php';
    }

    /**
     * The installed domain classes this process boots: all of them, unless JOURNAL_BOOTED_DOMAINS names a part, as a
     * test does to boot core alone or one domain with those it requires. An empty name list boots none.
     *
     * @return list<class-string<Domain>>
     */
    public static function bootedClasses(string $basePath): array
    {
        $installed = self::installedClasses($basePath);
        $named = $_SERVER[self::BOOTED_DOMAINS] ?? getenv(self::BOOTED_DOMAINS);

        if (! is_string($named)) {
            return $installed;
        }

        $booted = array_filter(explode(',', $named));

        return array_values(array_filter($installed, fn (string $class) => in_array($class, $booted, true)));
    }
}
