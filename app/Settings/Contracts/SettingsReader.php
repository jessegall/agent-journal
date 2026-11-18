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
use App\Settings\Support\DisabledSettingsGroup;
use App\Settings\Values\Decimal;
use BackedEnum;

/**
 * The current value of any registered setting, for whoever runs, with or without an actor: its stored override or its
 * declared default. A setting of a group that can be switched off is read through group().
 */
interface SettingsReader
{
    public function string(StringSetting $setting): string;

    public function boolean(BooleanSetting $setting): bool;

    public function integer(IntegerSetting $setting): int;

    public function decimal(DecimalSetting $setting): Decimal;

    /**
     * @param  ChoiceSetting<string>  $setting
     */
    public function stringChoice(ChoiceSetting $setting): string;

    /**
     * @param  ChoiceSetting<int>  $setting
     */
    public function integerChoice(ChoiceSetting $setting): int;

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     */
    public function enum(EnumSetting $setting): BackedEnum;

    public function group(ToggleGroup $group): EnabledSettingsGroup|DisabledSettingsGroup;

    public function snapshot(SettingsDefinition $definition): SettingsSnapshot;
}
