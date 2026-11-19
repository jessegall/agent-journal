<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\Exceptions\SettingUnavailable;

/**
 * Every owner's settings definition, checked once at start-up and never changed. A setting or group resolves to its
 * owner and key only as the exact object its owner registered.
 */
final readonly class SettingRegistry
{
    public const string CORE = 'Core';

    public const int SETTINGS_PER_OWNER = 500;

    public const int GROUPS_PER_OWNER = 100;

    /**
     * @param  array<string, SettingsDefinition>  $definitions
     * @param  array<int, SettingAddress>  $addresses  keyed by the object id of each registered setting and group
     * @param  array<int, GroupDeclaration>  $groups  the group of each registered setting, keyed by the setting's object id
     */
    private function __construct(private array $definitions, private array $addresses, private array $groups) {}

    /**
     * @param  array<string, SettingsDefinition>  $definitions  keyed by owner name, Core first
     *
     * @throws SettingDeclarationInvalid
     */
    public static function from(array $definitions): self
    {
        if (array_key_first($definitions) !== self::CORE) {
            throw SettingDeclarationInvalid::coreNotFirst();
        }

        $ownerNames = [];
        $definitionOwners = [];
        $addresses = [];
        $groups = [];

        foreach ($definitions as $owner => $definition) {
            if (isset($ownerNames[strtolower($owner)])) {
                throw SettingDeclarationInvalid::ownerTwice($owner);
            }

            $ownerNames[strtolower($owner)] = true;

            if (isset($definitionOwners[$definition::class]) && ! $definition instanceof EmptySettingsDefinition) {
                throw SettingDeclarationInvalid::definitionTwice($owner, $definition::class);
            }

            $definitionOwners[$definition::class] = $owner;
            $addresses += self::addressesOf($owner, $definition);

            foreach ($definition->groups() as $group) {
                foreach ($group->settings() as $setting) {
                    $groups[spl_object_id($setting)] = $group;
                }
            }
        }

        return new self($definitions, $addresses, $groups);
    }

    /**
     * @return array<string, SettingsDefinition>
     */
    public function definitions(): array
    {
        return $this->definitions;
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function definition(string $owner): SettingsDefinition
    {
        return $this->definitions[$owner] ?? throw SettingHandleUnknown::owner($owner);
    }

    /**
     * The owner a registered definition belongs to, known by the exact object registered.
     *
     * @throws SettingHandleUnknown
     */
    public function ownerOfDefinition(SettingsDefinition $definition): string
    {
        $owner = array_search($definition, $this->definitions, true);

        return is_string($owner) ? $owner : throw SettingHandleUnknown::definition($definition::class);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function ownerOf(Setting|GroupDeclaration $handle): SettingAddress
    {
        return $this->addresses[spl_object_id($handle)]
            ?? throw SettingHandleUnknown::for($handle::class, $handle->key());
    }

    /**
     * The group a registered setting is declared in.
     *
     * @throws SettingHandleUnknown
     */
    public function groupOf(Setting $setting): GroupDeclaration
    {
        return $this->groups[spl_object_id($setting)]
            ?? throw SettingHandleUnknown::for($setting::class, $setting->key());
    }

    /**
     * The registered setting an address names, for a command that carries only the address.
     *
     * @throws SettingUnavailable
     */
    public function settingAt(string $owner, string $key): Setting
    {
        foreach ($this->groupsOf($owner) as $group) {
            foreach ($group->settings() as $setting) {
                if ($setting->key() === $key) {
                    return $setting;
                }
            }
        }

        throw SettingUnavailable::for($owner, $key);
    }

    /**
     * The registered group an address names, for a command that carries only the address.
     *
     * @throws SettingUnavailable
     */
    public function groupAt(string $owner, string $key): GroupDeclaration
    {
        foreach ($this->groupsOf($owner) as $group) {
            if ($group->key() === $key) {
                return $group;
            }
        }

        throw SettingUnavailable::for($owner, $key);
    }

    /**
     * Whether a registered setting sits in a group that can be switched off, so it is read through its group.
     *
     * @throws SettingHandleUnknown
     */
    public function isInToggleGroup(Setting $setting): bool
    {
        return $this->groupOf($setting) instanceof ToggleGroup;
    }

    /**
     * The groups of an owner, none for a name no definition is registered under.
     *
     * @return list<GroupDeclaration>
     */
    private function groupsOf(string $owner): array
    {
        return array_key_exists($owner, $this->definitions) ? $this->definitions[$owner]->groups() : [];
    }

    /**
     * @return array<int, SettingAddress>
     *
     * @throws SettingDeclarationInvalid
     */
    private static function addressesOf(string $owner, SettingsDefinition $definition): array
    {
        $groups = $definition->groups();

        if (count($groups) > self::GROUPS_PER_OWNER) {
            throw SettingDeclarationInvalid::tooManyGroups($owner, self::GROUPS_PER_OWNER);
        }

        $addresses = [];
        $groupKeys = [];
        $settingKeys = [];

        foreach ($groups as $group) {
            if (isset($groupKeys[$group->key()])) {
                throw SettingDeclarationInvalid::groupTwice($owner, $group->key());
            }

            $groupKeys[$group->key()] = true;
            $addresses[spl_object_id($group)] = new SettingAddress($owner, $group->key());

            foreach ($group->settings() as $setting) {
                if (isset($settingKeys[$setting->key()])) {
                    throw SettingDeclarationInvalid::settingTwice($owner, $setting->key());
                }

                $settingKeys[$setting->key()] = true;
                $addresses[spl_object_id($setting)] = new SettingAddress($owner, $setting->key());
            }
        }

        if (count($settingKeys) > self::SETTINGS_PER_OWNER) {
            throw SettingDeclarationInvalid::tooManySettings($owner, self::SETTINGS_PER_OWNER);
        }

        return $addresses;
    }
}
