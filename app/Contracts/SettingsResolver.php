<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;
use App\Support\DisabledSettingsGroup;
use App\Values\Decimal;
use BackedEnum;

/**
 * The current value of any registered setting, for whoever runs, with or without an actor: its stored override or its
 * declared default. A setting of a group that can be switched off is read through group().
 */
interface SettingsResolver
{
    public function string(StringSetting $setting): string;

    public function boolean(BooleanSetting $setting): bool;

    public function integer(IntegerSetting $setting): int;

    public function decimal(DecimalSetting $setting): Decimal;

    /**
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     */
    public function choice(ChoiceSetting $setting): string|int;

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
