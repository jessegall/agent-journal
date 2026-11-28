<?php

declare(strict_types=1);

namespace App\Settings;

use App\Settings\Contracts\EnabledSettingsGroup as EnabledSettingsGroupContract;
use App\Settings\Contracts\Setting;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\GroupSnapshotRequired;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Storage\EncodedEntry;
use App\Settings\Values\Decimal;
use App\Support\Storage\SettingsDocument;
use BackedEnum;

/**
 * One owner's stored overrides at one revision, read once: each setting's value is its decoded override, or its
 * declared default when it has none. The typed reads here check only the owner; callers check the group.
 *
 * @internal
 */
final readonly class StoredSettings
{
    public function __construct(
        public string $owner,
        public int $revision,
        private SettingsDocument $document,
        private SettingCodec $codec,
        private SettingRegistry $registry,
    ) {}

    /**
     * Refuses a setting of another owner or of a group that can be switched off.
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     */
    public function requirePlain(Setting $setting): void
    {
        $this->assertOwnSetting($setting);

        if ($this->registry->isInToggleGroup($setting)) {
            throw GroupSnapshotRequired::for($this->owner, $setting->key());
        }
    }

    /**
     * @throws SettingUnavailable
     */
    public function assertOwnSetting(Setting $setting): void
    {
        if ($this->registry->ownerOf($setting)->owner !== $this->owner) {
            throw SettingUnavailable::for($this->owner, $setting->key());
        }
    }

    /**
     * The group as it stands at this revision: on with its children's values, or off with none.
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function group(ToggleGroup $group): EnabledSettingsGroupContract|DisabledSettingsGroup
    {
        if ($this->registry->ownerOf($group)->owner !== $this->owner) {
            throw SettingUnavailable::for($this->owner, $group->key);
        }

        $enabled = $this->document->toggle($group->key)
            ->map(fn (EncodedEntry $toggle) => $this->codec->decodeToggle(
                $this->owner,
                $group,
                $toggle->value,
            ))
            ->getOrElse($group->isDefaultEnabled);

        if ($enabled) {
            return new EnabledSettingsGroup($group, $this, $this->registry);
        }

        return new DisabledSettingsGroup($this->owner, $group->key, $this->revision);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function string(StringSetting $setting): string
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedEntry $stored) => $this->codec->decodeString(
                $this->owner,
                $setting,
                $stored->value,
            ))
            ->getOrElse($setting->defaultValue);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedEntry $stored) => $this->codec->decodeBoolean(
                $this->owner,
                $setting,
                $stored->value,
            ))
            ->getOrElse($setting->isDefault);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedEntry $stored) => $this->codec->decodeInteger(
                $this->owner,
                $setting,
                $stored->value,
            ))
            ->getOrElse($setting->defaultValue);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decimal(DecimalSetting $setting): Decimal
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedEntry $stored) => $this->codec->decodeDecimal(
                $this->owner,
                $setting,
                $stored->value,
            ))
            ->getOrElse($setting->defaultValue);
    }

    /**
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     *
     * @throws SettingStorageInvalid
     */
    public function choice(ChoiceSetting $setting): string|int
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedEntry $stored) => $this->codec->decodeChoice(
                $this->owner,
                $setting,
                $stored->value,
            ))
            ->getOrElse($setting->defaultValue);
    }

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedEntry $stored) => $this->codec->decodeEnum(
                $this->owner,
                $setting,
                $stored->value,
            ))
            ->getOrElse($setting->defaultValue);
    }
}
