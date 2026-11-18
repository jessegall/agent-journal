<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandRegistry;
use App\Domains\Exceptions\AlwaysOnDomainRequiresSwitchable;
use App\Domains\Exceptions\AmbiguousDomainRoot;
use App\Domains\Exceptions\DomainCycle;
use App\Domains\Exceptions\DomainListedTwice;
use App\Domains\Exceptions\DomainNotFound;
use App\Domains\Exceptions\RequiredDomainMissing;
use App\Mcp\Contracts\McpRegistration;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Values\CommandRule;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\SettingRegistry;
use App\Skills\Values\SkillConditionRegistration;
use App\Skills\Values\SkillOwner;
use App\Ui\Declarations\DomainUi;
use App\Ui\Support\UiDeclarations;

/**
 * Every registered domain by name, checked once when the list is read and never changed after.
 */
final readonly class DomainRegistry
{
    /**
     * @param  array<string, DomainEntry>  $entries
     */
    private function __construct(private array $entries) {}

    /**
     * @param  list<string>  $classNames
     */
    public static function from(array $classNames): self
    {
        $entries = [];

        foreach ($classNames as $className) {
            $entry = DomainEntry::fromClass($className);

            if (array_key_exists($entry->name, $entries)) {
                throw DomainListedTwice::for($entry->name);
            }

            foreach ($entries as $earlier) {
                if ($earlier->overlaps($entry)) {
                    throw AmbiguousDomainRoot::between($earlier->name, $entry->name);
                }
            }

            $entries[$entry->name] = $entry;
        }

        $listedClasses = array_map(fn (DomainEntry $entry) => $entry->className(), $entries);

        foreach ($entries as $entry) {
            foreach ($entry->requires as $requiredClass) {
                if (! in_array($requiredClass, $listedClasses, true)) {
                    throw RequiredDomainMissing::for($entry->name, DomainEntry::nameOf($requiredClass));
                }
            }
        }

        foreach ($entries as $entry) {
            self::refuseCycleFrom($entries, $entry, []);
        }

        foreach ($entries as $entry) {
            self::refuseAlwaysOnRequiringSwitchable($entries, $entry);
        }

        return new self($entries);
    }

    /**
     * @return list<DomainEntry>
     */
    public function all(): array
    {
        return array_values($this->entries);
    }

    public function has(string $name): bool
    {
        return array_key_exists($name, $this->entries);
    }

    public function get(string $name): DomainEntry
    {
        return $this->entries[$name] ?? throw DomainNotFound::for($name);
    }

    /**
     * The pages, navigation and sections every domain declares through ProvidesPages, ProvidesNavigation and
     * ProvidesSections, checked together with Core's own; a domain that declares none of them adds nothing.
     */
    public function uiDeclarations(DomainUi ...$coreDeclarations): UiDeclarations
    {
        return UiDeclarations::check(array_values([...$coreDeclarations, ...array_map(fn (DomainEntry $entry) => $entry->ui(), $this->all())]));
    }

    /**
     * Every owner's commands and middleware, Core's first and then the domains in bootstrap/domains.php order, checked
     * together; start-up stops at the first wrong declaration.
     */
    public function commandDeclarations(CommandOwner $core): CommandRegistry
    {
        return CommandRegistry::from([$core, ...array_map(fn (DomainEntry $entry) => $entry->commandOwner(), $this->all())]);
    }

    /**
     * Every owner of skills, Core's first and then the domains in bootstrap/domains.php order.
     *
     * @return list<SkillOwner>
     */
    public function skillDeclarations(SkillOwner $core): array
    {
        return [$core, ...array_map(fn (DomainEntry $entry) => $entry->skillOwner(), $this->all())];
    }

    /**
     * Every domain's named skill condition types, by domain name, in bootstrap/domains.php order.
     *
     * @return array<string, list<SkillConditionRegistration>>
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
     * Core's built-in command rules with every domain's own, which wait for review.
     *
     * @param  list<CommandRule>  $coreRules
     */
    public function commandRules(array $coreRules): CommandRuleRegistry
    {
        return CommandRuleRegistry::from([...$coreRules, ...array_merge(...array_map(fn (DomainEntry $entry): array => $entry->commandRules(), $this->all()))]);
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
     * Every owner's settings, Core's first under its reserved name and then the domains in bootstrap/domains.php
     * order, checked together; start-up stops at the first wrong declaration.
     *
     * One Core switch per domain that can be switched off, keyed domain_<name>, on by default and holding no
     * settings; a name that makes an invalid key fails like any declaration.
     *
     * @throws SettingDeclarationInvalid
     */
    public function domainSwitches(): DomainSwitches
    {
        $groups = [];

        foreach ($this->all() as $entry) {
            if ($entry->canDisable()) {
                $groups[$entry->name] = ToggleGroup::make('domain_'.strtolower($entry->name), $entry->name, true, []);
            }
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

            $definitions[$entry->name] = $entry->settings();
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
     * @param  array<string, DomainEntry>  $entries
     * @param  list<string>  $path
     */
    private static function refuseCycleFrom(array $entries, DomainEntry $entry, array $path): void
    {
        $position = array_search($entry->name, $path, true);

        if ($position !== false) {
            throw DomainCycle::for([...array_slice($path, $position), $entry->name]);
        }

        foreach ($entry->requires as $requiredClass) {
            self::refuseCycleFrom($entries, $entries[DomainEntry::nameOf($requiredClass)], [...$path, $entry->name]);
        }
    }

    /**
     * A domain that can never be switched off may require only domains that cannot be either.
     *
     * @param  array<string, DomainEntry>  $entries
     *
     * @throws AlwaysOnDomainRequiresSwitchable
     */
    private static function refuseAlwaysOnRequiringSwitchable(array $entries, DomainEntry $entry): void
    {
        if ($entry->canDisable()) {
            return;
        }

        foreach ($entry->requires as $requiredClass) {
            $required = $entries[DomainEntry::nameOf($requiredClass)];

            if ($required->canDisable()) {
                throw AlwaysOnDomainRequiresSwitchable::for($entry->name, $required->name);
            }
        }
    }
}
