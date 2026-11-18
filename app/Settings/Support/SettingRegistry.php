<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Exceptions\SettingHandleUnknown;

/**
 * Every owner's settings definition, checked once at start-up and never changed. A setting or group resolves to its
 * owner and key only as the exact object its owner registered.
 */
final readonly class SettingRegistry
{
    public const string CORE = 'Core';

    private const int SETTINGS_PER_OWNER = 500;

    private const int GROUPS_PER_OWNER = 100;

    /**
     * @param  array<string, SettingsDefinition>  $definitions
     * @param  array<int, SettingAddress>  $addresses  keyed by the object id of each registered setting and group
     */
    private function __construct(private array $definitions, private array $addresses) {}

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
        }

        return new self($definitions, $addresses);
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
     * @throws SettingHandleUnknown
     */
    public function ownerOf(Setting|SettingGroup $handle): SettingAddress
    {
        return $this->addresses[spl_object_id($handle)] ?? throw SettingHandleUnknown::for($handle::class, $handle->key());
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
            throw SettingDeclarationInvalid::tooManyGroups($owner);
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
            throw SettingDeclarationInvalid::tooManySettings($owner);
        }

        return $addresses;
    }
}
