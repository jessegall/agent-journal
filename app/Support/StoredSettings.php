<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Settings\EnabledSettingsGroup as EnabledSettingsGroupContract;
use App\Contracts\Settings\Setting;
use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;
use App\Exceptions\GroupSnapshotRequired;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingUnavailable;
use App\Support\Storage\EncodedSetting;
use App\Support\Storage\EncodedToggle;
use App\Support\Storage\SettingsDocument;
use App\Values\Decimal;
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
            ->map(fn (EncodedToggle $toggle) => $this->codec->decodeToggle(
                $this->owner,
                $group,
                $toggle->encodedToggle,
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
            ->map(fn (EncodedSetting $stored) => $this->codec->decodeString(
                $this->owner,
                $setting,
                $stored->encodedSetting,
            ))
            ->getOrElse($setting->defaultValue);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedSetting $stored) => $this->codec->decodeBoolean(
                $this->owner,
                $setting,
                $stored->encodedSetting,
            ))
            ->getOrElse($setting->isDefault);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedSetting $stored) => $this->codec->decodeInteger(
                $this->owner,
                $setting,
                $stored->encodedSetting,
            ))
            ->getOrElse($setting->defaultValue);
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decimal(DecimalSetting $setting): Decimal
    {
        return $this->document->setting($setting->key)
            ->map(fn (EncodedSetting $stored) => $this->codec->decodeDecimal(
                $this->owner,
                $setting,
                $stored->encodedSetting,
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
            ->map(fn (EncodedSetting $stored) => $this->codec->decodeChoice(
                $this->owner,
                $setting,
                $stored->encodedSetting,
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
            ->map(fn (EncodedSetting $stored) => $this->codec->decodeEnum(
                $this->owner,
                $setting,
                $stored->encodedSetting,
            ))
            ->getOrElse($setting->defaultValue);
    }
}
