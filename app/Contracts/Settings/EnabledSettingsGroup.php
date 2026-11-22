<?php

declare(strict_types=1);

namespace App\Contracts\Settings;

use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\StringSetting;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingUnavailable;
use App\Values\Decimal;
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
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     *
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function choice(ChoiceSetting $setting): string|int;

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
