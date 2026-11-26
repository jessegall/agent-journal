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
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Values\Decimal;
use BackedEnum;

/**
 * A group that can be switched off, read while it was on: the values of its own settings, all at the one revision it
 * was read at, whatever is written later.
 */
final readonly class EnabledSettingsGroup implements EnabledSettingsGroupContract
{
    public string $owner;

    public string $key;

    public int $revision;

    public function __construct(
        private ToggleGroup $group,
        private StoredSettings $stored,
        private SettingRegistry $registry,
    ) {
        $this->owner = $stored->owner;
        $this->key = $group->key;
        $this->revision = $stored->revision;
    }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function string(StringSetting $setting): string
    {
        $this->requireMember($setting);

        return $this->stored->string($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool
    {
        $this->requireMember($setting);

        return $this->stored->boolean($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int
    {
        $this->requireMember($setting);

        return $this->stored->integer($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function decimal(DecimalSetting $setting): Decimal
    {
        $this->requireMember($setting);

        return $this->stored->decimal($setting);
    }

    /**
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function choice(ChoiceSetting $setting): string|int
    {
        $this->requireMember($setting);

        return $this->stored->choice($setting);
    }

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum
    {
        $this->requireMember($setting);

        return $this->stored->enum($setting);
    }

    /**
     * @throws SettingUnavailable
     */
    private function requireMember(Setting $setting): void
    {
        $this->stored->assertOwnSetting($setting);

        if ($this->registry->groupOf($setting) !== $this->group) {
            throw SettingUnavailable::for($this->owner, $setting->key());
        }
    }
}
