<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

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
use App\Settings\Support\DisabledSettingsGroup;
use App\Settings\Values\Decimal;
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
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function stringChoice(ChoiceSetting $setting): string;

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingUnavailable
     * @throws GroupSnapshotRequired
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
     * @throws GroupSnapshotRequired
     * @throws SettingStorageInvalid
     */
    public function enum(EnumSetting $setting): BackedEnum;
}
