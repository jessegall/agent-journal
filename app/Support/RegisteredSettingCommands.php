<?php

declare(strict_types=1);

namespace App\Support;

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
use App\Contracts\Navigation\GroupDeclaration;
use App\Contracts\Reflection\ReflectorFactory;
use App\Contracts\Settings\Setting;
use App\Contracts\Settings\SettingCommands;
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
use App\Values\GroupReference;
use App\Values\SettingReference;
use BackedEnum;

/**
 * Builds the settings commands from the registered declarations, addressing each by its registered owner and key.
 * Building a command grants nothing: its handler checks who runs it, the value and the revision again.
 */
final readonly class RegisteredSettingCommands implements SettingCommands
{
    public function __construct(private SettingRegistry $registry, private ReflectorFactory $reflectors) {}

    /**
     * @throws SettingHandleUnknown
     */
    public function string(StringSetting $setting, string $input, int $expectedRevision): SetStringSettingCommand
    {
        return new SetStringSettingCommand($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function boolean(BooleanSetting $setting, bool $input, int $expectedRevision): SetBooleanSettingCommand
    {
        return new SetBooleanSettingCommand($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function integer(IntegerSetting $setting, int $input, int $expectedRevision): SetIntegerSettingCommand
    {
        return new SetIntegerSettingCommand($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function decimal(DecimalSetting $setting, Decimal $input, int $expectedRevision): SetDecimalSettingCommand
    {
        return new SetDecimalSettingCommand($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @param  ChoiceSetting<string>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function stringChoice(ChoiceSetting $setting, string $input, int $expectedRevision): SetStringChoiceCommand
    {
        return new SetStringChoiceCommand($this->settingReference($setting), $input, $expectedRevision);
    }

    /**
     * @param  ChoiceSetting<int>  $setting
     *
     * @throws SettingHandleUnknown
     */
    public function integerChoice(ChoiceSetting $setting, int $input, int $expectedRevision): SetIntegerChoiceCommand
    {
        return new SetIntegerChoiceCommand($this->settingReference($setting), $input, $expectedRevision);
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
    public function enumString(EnumSetting $setting, BackedEnum $input, int $expectedRevision): SetStringChoiceCommand
    {
        $reference = $this->settingReference($setting);
        $backing = $input->value;

        if ($this->reflectors->make($setting->enum)->asInstance($input)->isEmpty() || ! is_string($backing)) {
            throw SettingValueInvalid::for($reference->owner, $reference->key, $setting->type());
        }

        return new SetStringChoiceCommand($reference, $backing, $expectedRevision);
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
    public function enumInteger(EnumSetting $setting, BackedEnum $input, int $expectedRevision): SetIntegerChoiceCommand
    {
        $reference = $this->settingReference($setting);
        $backing = $input->value;

        if ($this->reflectors->make($setting->enum)->asInstance($input)->isEmpty() || ! is_int($backing)) {
            throw SettingValueInvalid::for($reference->owner, $reference->key, $setting->type());
        }

        return new SetIntegerChoiceCommand($reference, $backing, $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function reset(Setting $setting, int $expectedRevision): ResetSettingCommand
    {
        return new ResetSettingCommand($this->settingReference($setting), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function enable(ToggleGroup $group, int $expectedRevision): EnableSettingGroupCommand
    {
        return new EnableSettingGroupCommand($this->groupReference($group), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function disable(ToggleGroup $group, int $expectedRevision): DisableSettingGroupCommand
    {
        return new DisableSettingGroupCommand($this->groupReference($group), $expectedRevision);
    }

    /**
     * @throws SettingHandleUnknown
     */
    public function resetGroup(ToggleGroup|SettingGroup $group, int $expectedRevision): ResetSettingGroupCommand
    {
        return new ResetSettingGroupCommand($this->groupReference($group), $expectedRevision);
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
