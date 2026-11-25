<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Navigation\GroupDeclaration;
use App\Contracts\Settings\CatalogueValue;
use App\Contracts\Settings\Setting;
use App\Contracts\Settings\SettingsCatalogue as SettingsCatalogueContract;
use App\Data\Settings\InvalidValueData;
use App\Data\Settings\PlainGroupAvailabilityData;
use App\Data\Settings\SettingData;
use App\Data\Settings\SettingGroupData;
use App\Data\Settings\SettingIdentityData;
use App\Data\Settings\SettingsCatalogueData;
use App\Data\Settings\ToggleGroupAvailabilityData;
use App\Declarations\ToggleGroup;
use App\Enums\Settings\GroupAvailability;
use App\Enums\Settings\SettingAvailability;
use App\Enums\Settings\SettingSource;
use App\Exceptions\SettingsOwnerUnknown;
use App\Exceptions\SettingStorageInvalid;
use App\Models\Records\SettingsRecord;
use App\Support\Storage\EncodedSetting;
use App\Support\Storage\EncodedToggle;
use App\Support\Storage\SettingsDocument;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * Builds one owner's catalogue from a single read of its record, for an actor the access policy allows. A stored value
 * its setting does not accept is shown as invalid with its address, so it can be reset; the rest stay readable.
 */
final readonly class SettingsCatalogue implements SettingsCatalogueContract
{
    public const string TITLE = 'Settings';

    public function __construct(
        private SettingsAccessGate $gate,
        private SettingRegistry $registry,
        private SettingCodec $codec,
    ) {}

    public function owner(string $owner): SettingsCatalogueData
    {
        $this->gate->require();

        if (! array_key_exists($owner, $this->registry->definitions())) {
            throw SettingsOwnerUnknown::for($owner);
        }

        return $this->catalogueOf($owner, SettingsRecord::sharedRuntimeForOwner($owner));
    }

    public function everyOwner(): array
    {
        $this->gate->require();
        $owners = array_keys($this->registry->definitions());
        $records = SettingsRecord::sharedRuntimeForOwners($owners);

        return array_map(
            fn (string $owner) => $this->catalogueOf($owner, Option::fromArraysValue($records, $owner)),
            $owners,
        );
    }

    /**
     * @param  Option<SettingsRecord>  $record
     */
    private function catalogueOf(string $owner, Option $record): SettingsCatalogueData
    {
        $document = $record->map(
            fn (SettingsRecord $found) => $found->document,
        )->getOrCall(SettingsDocument::empty(...));

        return SettingsCatalogueData::from([
            'owner' => $owner,
            'title' => self::TITLE,
            'revision' => $record->map(fn (SettingsRecord $found) => $found->revision)->getOrElse(0),
            'groups' => array_map(
                fn (GroupDeclaration $group) => $this->group($owner, $group, $document),
                $this->registry->definition($owner)->groups(),
            ),
        ]);
    }

    private function group(string $owner, GroupDeclaration $group, SettingsDocument $document): SettingGroupData
    {
        $state = $group instanceof ToggleGroup ? $this->toggleState(
            $owner,
            $group,
            $document,
        ) : GroupAvailability::Always;

        $availability = $group instanceof ToggleGroup
            ? ToggleGroupAvailabilityData::from([
                'state' => $state,
                'isDefaultEnabled' => $group->isDefaultEnabled,
            ])
            : PlainGroupAvailabilityData::from([]);

        return SettingGroupData::from([
            'identity' => $this->identity($owner, $group->key()),
            'label' => $group->label(),
            'description' => $group->description(),
            'availability' => $availability,
            'settings' => array_map(
                fn (Setting $setting) => $this->setting($owner, $setting, $state, $document),
                $group->settings(),
            ),
        ]);
    }

    /**
     * Whether the group is on, off, or has a stored switch that is not a boolean.
     */
    private function toggleState(string $owner, ToggleGroup $group, SettingsDocument $document): GroupAvailability
    {
        try {
            $enabled = $document->toggle($group->key)
                ->map(fn (EncodedToggle $toggle) => $this->codec->decodeToggle($owner, $group, $toggle->encodedToggle))
                ->getOrElse($group->isDefaultEnabled);
        } catch (SettingStorageInvalid) {
            return GroupAvailability::Invalid;
        }

        if ($enabled) {
            return GroupAvailability::Enabled;
        }

        return GroupAvailability::Disabled;
    }

    private function setting(
        string $owner,
        Setting $setting,
        GroupAvailability $groupState,
        SettingsDocument $document,
    ): SettingData {
        $stored = $document->setting($setting->key());

        return SettingData::from([
            'identity' => $this->identity($owner, $setting->key()),
            'label' => $setting->label(),
            'description' => $setting->description(),
            'type' => $setting->type(),
            'source' => $stored->isDefined() ? SettingSource::Override : SettingSource::Default,
            'availability' => match ($groupState) {
                GroupAvailability::Disabled => SettingAvailability::GroupDisabled,
                GroupAvailability::Invalid => SettingAvailability::GroupInvalid,
                default => SettingAvailability::Available,
            },
            'default' => $setting->catalogueValue($setting->isEnabledByDefault()),
            'constraints' => $setting->catalogueConstraints(),
            'configured' => $stored->map(
                fn (EncodedSetting $entry) => $this->configured($owner, $setting, $entry),
            )->getOrCall(Optional::create(...)),
        ]);
    }

    /**
     * The stored value when the setting accepts it, otherwise a marker that names nothing of what was stored.
     */
    private function configured(string $owner, Setting $setting, EncodedSetting $entry): CatalogueValue
    {
        try {
            return $setting->catalogueValue($this->codec->decode($owner, $setting, $entry->encodedSetting));
        } catch (SettingStorageInvalid) {
            return InvalidValueData::from([]);
        }
    }

    private function identity(string $owner, string $key): SettingIdentityData
    {
        return SettingIdentityData::from([
            'owner' => $owner,
            'key' => $key,
            'canonicalKey' => "{$owner}.{$key}",
        ]);
    }
}
