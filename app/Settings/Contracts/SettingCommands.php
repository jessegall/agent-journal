<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Settings\Commands\EnableSettingGroup\EnableSettingGroupCommand;
use App\Settings\Commands\ResetSetting\ResetSettingCommand;
use App\Settings\Commands\ResetSettingGroup\ResetSettingGroupCommand;
use App\Settings\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Settings\Commands\SetDecimalSetting\SetDecimalSettingCommand;
use App\Settings\Commands\SetIntegerChoice\SetIntegerChoiceCommand;
use App\Settings\Commands\SetIntegerSetting\SetIntegerSettingCommand;
use App\Settings\Commands\SetStringChoice\SetStringChoiceCommand;
use App\Settings\Commands\SetStringSetting\SetStringSettingCommand;
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
    public function string(
        StringSetting $setting,
        string $settingInput,
        int $expectedRevision,
    ): SetStringSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function boolean(
        BooleanSetting $setting,
        bool $settingInput,
        int $expectedRevision,
    ): SetBooleanSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function integer(
        IntegerSetting $setting,
        int $settingInput,
        int $expectedRevision,
    ): SetIntegerSettingCommand;

    /**
     * @throws SettingHandleUnknown
     */
    public function decimal(
        DecimalSetting $setting,
        Decimal $settingInput,
        int $expectedRevision,
    ): SetDecimalSettingCommand;

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function stringChoice(
        ChoiceSetting $setting,
        string $settingInput,
        int $expectedRevision,
    ): SetStringChoiceCommand;

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function integerChoice(
        ChoiceSetting $setting,
        int $settingInput,
        int $expectedRevision,
    ): SetIntegerChoiceCommand;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $settingInput
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumString(
        EnumSetting $setting,
        BackedEnum $settingInput,
        int $expectedRevision,
    ): SetStringChoiceCommand;

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
