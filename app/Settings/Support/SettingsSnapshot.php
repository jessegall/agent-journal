<?php

declare(strict_types=1);

namespace App\Settings\Support;

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
use App\Settings\Values\Decimal;
use BackedEnum;

/**
 * Every setting of one owner from one read at one revision: the plain groups' settings directly and each group that
 * can be switched off through group(). It lives no longer than the request or job that took it.
 */
final readonly class SettingsSnapshot
{
    public string $owner;

    public int $revision;

    public function __construct(private StoredSettings $stored)
    {
        $this->owner = $stored->owner;
        $this->revision = $stored->revision;
    }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function group(ToggleGroup $group): EnabledSettingsGroup|DisabledSettingsGroup
    {
        return $this->stored->group($group);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function string(StringSetting $setting): string
    {
        $this->stored->requirePlain($setting);

        return $this->stored->string($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool
    {
        $this->stored->requirePlain($setting);

        return $this->stored->boolean($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int
    {
        $this->stored->requirePlain($setting);

        return $this->stored->integer($setting);
    }

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function decimal(DecimalSetting $setting): Decimal
    {
        $this->stored->requirePlain($setting);

        return $this->stored->decimal($setting);
    }

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function stringChoice(ChoiceSetting $setting): string
    {
        $this->stored->requirePlain($setting);

        return $this->stored->choice($setting);
    }

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function integerChoice(ChoiceSetting $setting): int
    {
        $this->stored->requirePlain($setting);

        return $this->stored->choice($setting);
    }

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum
    {
        $this->stored->requirePlain($setting);

        return $this->stored->enum($setting);
    }
}
