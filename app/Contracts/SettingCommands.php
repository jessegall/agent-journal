<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\EnableSettingGroup\EnableSettingGroupCommand;
use App\Commands\ResetSetting\ResetSettingCommand;
use App\Commands\ResetSettingGroup\ResetSettingGroupCommand;
use App\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Commands\SetDecimalSetting\SetDecimalSettingCommand;
use App\Commands\SetIntegerChoice\SetIntegerChoiceCommand;
use App\Commands\SetIntegerSetting\SetIntegerSettingCommand;
use App\Commands\SetStringChoice\SetStringChoiceCommand;
use App\Commands\SetStringSetting\SetStringSettingCommand;
use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;
use App\Exceptions\SettingHandleUnknown;
use App\Exceptions\SettingValueInvalid;
use App\Values\Decimal;
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
    public function string(StringSetting $setting, string $settingInput, int $expectedRevision): SetStringSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function boolean(BooleanSetting $setting, bool $settingInput, int $expectedRevision): SetBooleanSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function integer(IntegerSetting $setting, int $settingInput, int $expectedRevision): SetIntegerSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function decimal(DecimalSetting $setting, Decimal $settingInput, int $expectedRevision): SetDecimalSettingCommand;

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function stringChoice(ChoiceSetting $setting, string $settingInput, int $expectedRevision): SetStringChoiceCommand;

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function integerChoice(ChoiceSetting $setting, int $settingInput, int $expectedRevision): SetIntegerChoiceCommand;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $settingInput
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumString(EnumSetting $setting, BackedEnum $settingInput, int $expectedRevision): SetStringChoiceCommand;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $settingInput
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumInteger(
        EnumSetting $setting,
        BackedEnum $settingInput,
        int $expectedRevision,
    ): SetIntegerChoiceCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function reset(Setting $setting, int $expectedRevision): ResetSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function enable(ToggleGroup $group, int $expectedRevision): EnableSettingGroupCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function disable(ToggleGroup $group, int $expectedRevision): DisableSettingGroupCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function resetGroup(ToggleGroup|SettingGroup $group, int $expectedRevision): ResetSettingGroupCommand;
}
