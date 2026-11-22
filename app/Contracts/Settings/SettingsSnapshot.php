<?php

declare(strict_types=1);

namespace App\Contracts\Settings;

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
use App\Support\DisabledSettingsGroup;
use App\Values\Decimal;
use BackedEnum;

/**
 * Every setting of one owner from one read at one revision: the plain groups' settings directly and each group that
 * can be switched off through group(). It lives no longer than the request or job that took it.
 */
interface SettingsSnapshot
{
    public string $owner { get; }

    public int $revision { get; }

    /**
     * @throws SettingUnavailable
     * @throws SettingStorageInvalid
     */
    public function group(ToggleGroup $group): EnabledSettingsGroup|DisabledSettingsGroup;

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function string(StringSetting $setting): string;

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function boolean(BooleanSetting $setting): bool;

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function integer(IntegerSetting $setting): int;

    /**
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
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
     * @throws GroupSnapshotRequired
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
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum;
}
