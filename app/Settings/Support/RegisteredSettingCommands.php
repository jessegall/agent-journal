<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Reflection\Support\Reflector;
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
use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingCommands;
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
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;
use BackedEnum;

/**
 * Builds the settings commands from the registered declarations, addressing each by its registered owner and key.
 * Building a command grants nothing: its handler checks who runs it, the value and the revision again.
 */
final readonly class RegisteredSettingCommands implements SettingCommands
{
    public function __construct(private SettingRegistry $registry) {}

    /**
     * @throws SettingHandleUnknown
     */
    public function string(StringSetting $setting, string $input, int $expectedRevision): SetStringSetting
    {
        return new SetStringSetting($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function boolean(BooleanSetting $setting, bool $input, int $expectedRevision): SetBooleanSetting
    {
        return new SetBooleanSetting($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function integer(IntegerSetting $setting, int $input, int $expectedRevision): SetIntegerSetting
    {
        return new SetIntegerSetting($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function decimal(DecimalSetting $setting, Decimal $input, int $expectedRevision): SetDecimalSetting
    {
        return new SetDecimalSetting($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function stringChoice(ChoiceSetting $setting, string $input, int $expectedRevision): SetStringChoice
    {
        return new SetStringChoice($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function integerChoice(ChoiceSetting $setting, int $input, int $expectedRevision): SetIntegerChoice
    {
        return new SetIntegerChoice($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * Chooses a case of a string-backed enum setting; the command carries the case's backing text, never the case.
     *
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $input
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumString(EnumSetting $setting, BackedEnum $input, int $expectedRevision): SetStringChoice
    {
        $reference = $this->settingReference($setting);
        $backing = $input->value;

        if (Reflector::of($setting->enum)->asInstance($input)->isEmpty() || ! is_string($backing)) {
            throw SettingValueInvalid::for($reference->owner, $reference->key, $setting->type());
        }

        return new SetStringChoice($reference, $backing, $expectedRevision);
    }

    /**
     * Chooses a case of an int-backed enum setting; the command carries the case's backing number, never the case.
     *
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @param  TEnum  $input
     *
     * @throws SettingHandleUnknown
     * @throws SettingValueInvalid
     */
    public function enumInteger(EnumSetting $setting, BackedEnum $input, int $expectedRevision): SetIntegerChoice
    {
        $reference = $this->settingReference($setting);
        $backing = $input->value;

        if (Reflector::of($setting->enum)->asInstance($input)->isEmpty() || ! is_int($backing)) {
            throw SettingValueInvalid::for($reference->owner, $reference->key, $setting->type());
        }

        return new SetIntegerChoice($reference, $backing, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function reset(Setting $setting, int $expectedRevision): ResetSetting
    {
        return new ResetSetting($this->settingReference($setting), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function enable(ToggleGroup $group, int $expectedRevision): EnableSettingGroup
    {
        return new EnableSettingGroup($this->groupReference($group), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function disable(ToggleGroup $group, int $expectedRevision): DisableSettingGroup
    {
        return new DisableSettingGroup($this->groupReference($group), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function resetGroup(ToggleGroup|SettingGroup $group, int $expectedRevision): ResetSettingGroup
    {
        return new ResetSettingGroup($this->groupReference($group), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    private function settingReference(Setting $setting): SettingReference
    {
        $address = $this->registry->ownerOf($setting);

        return new SettingReference($address->owner, $address->key);
    }

    /**
     * @throws SettingHandleUnknown
     */
    private function groupReference(GroupDeclaration $group): GroupReference
    {
        $address = $this->registry->ownerOf($group);

        return new GroupReference($address->owner, $address->key);
    }
}
