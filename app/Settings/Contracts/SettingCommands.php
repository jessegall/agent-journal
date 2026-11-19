<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Commands\ResetSetting;
use App\Settings\Commands\ResetSettingGroup;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Commands\SetDecimalSetting;
use App\Settings\Commands\SetIntegerChoice;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Commands\SetStringChoice;
use App\Settings\Commands\SetStringSetting;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Values\Decimal;
use BackedEnum;

/**
 * Builds the settings commands from the registered declarations, addressing each by its registered owner and key.
 * Building a command grants nothing: its handler checks who runs it, the value and the revision again.
 */
interface SettingCommands
{
    /**
     * @throws SettingHandleUnknown
     */
    public function string(StringSetting $setting, string $value, int $expectedRevision): SetStringSetting;

    /**
     * @throws SettingHandleUnknown
     */
    public function boolean(BooleanSetting $setting, bool $value, int $expectedRevision): SetBooleanSetting;

    /**
     * @throws SettingHandleUnknown
     */
    public function integer(IntegerSetting $setting, int $value, int $expectedRevision): SetIntegerSetting;

    /**
     * @throws SettingHandleUnknown
     */
    public function decimal(DecimalSetting $setting, Decimal $value, int $expectedRevision): SetDecimalSetting;

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function stringChoice(ChoiceSetting $setting, string $value, int $expectedRevision): SetStringChoice;

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function integerChoice(ChoiceSetting $setting, int $value, int $expectedRevision): SetIntegerChoice;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $value
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumString(EnumSetting $setting, BackedEnum $value, int $expectedRevision): SetStringChoice;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $value
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumInteger(EnumSetting $setting, BackedEnum $value, int $expectedRevision): SetIntegerChoice;

    /**
     * @throws SettingHandleUnknown
     */
    public function reset(Setting $setting, int $expectedRevision): ResetSetting;

    /**
     * @throws SettingHandleUnknown
     */
    public function enable(ToggleGroup $group, int $expectedRevision): EnableSettingGroup;

    /**
     * @throws SettingHandleUnknown
     */
    public function disable(ToggleGroup $group, int $expectedRevision): DisableSettingGroup;

    /**
     * @throws SettingHandleUnknown
     */
    public function resetGroup(ToggleGroup|SettingGroup $group, int $expectedRevision): ResetSettingGroup;
}
