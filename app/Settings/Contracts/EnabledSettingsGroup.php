<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Values\Decimal;
use BackedEnum;

/**
 * A group that can be switched off, read while it was on: the values of its own settings, all at the one revision it
 * was read at, whatever is written later.
 */
interface EnabledSettingsGroup
{
    public string $owner { get; }

    public string $key { get; }

    public int $revision { get; }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function string(StringSetting $setting): string;

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool;

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int;

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function decimal(DecimalSetting $setting): Decimal;

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function stringChoice(ChoiceSetting $setting): string;

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function integerChoice(ChoiceSetting $setting): int;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum;
}
