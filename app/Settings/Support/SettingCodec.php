<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\Setting;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\DecimalInvalid;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Storage\EncodedValue;
use App\Settings\Values\Decimal;
use BackedEnum;
use PhpOption\Option;

/**
 * Turns a setting's native value into its stored JSON and back, asking the declaration whether it accepts the value
 * and never converting one type into another: a stored entry is only checked when it is read.
 *
 * @internal
 */
final readonly class SettingCodec
{
    /**
     * @throws SettingValueInvalid
     */
    public function encodeString(string $owner, StringSetting $setting, string $value): EncodedValue
    {
        return $setting->accepts($value) ? EncodedValue::of($value) : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    public function encodeBoolean(BooleanSetting $setting, bool $value): EncodedValue
    {
        return EncodedValue::of($value);
    }

    /**
     * @throws SettingValueInvalid
     */
    public function encodeInteger(string $owner, IntegerSetting $setting, int $value): EncodedValue
    {
        return $setting->accepts($value) ? EncodedValue::of($value) : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    /**
     * Stores the value written at the setting's scale, as its canonical text.
     *
     * @throws SettingValueInvalid
     */
    public function encodeDecimal(string $owner, DecimalSetting $setting, Decimal $value): EncodedValue
    {
        try {
            return EncodedValue::of($setting->normalized($value)->text);
        } catch (DecimalInvalid) {
            throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
        }
    }

    /**
     * @param  ChoiceSetting<string|int>  $setting
     *
     * @throws SettingValueInvalid
     */
    public function encodeChoice(string $owner, ChoiceSetting $setting, string|int $value): EncodedValue
    {
        return $setting->accepts($value) ? EncodedValue::of($value) : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    /**
     * Stores the case's backing value.
     *
     * @param  EnumSetting<BackedEnum>  $setting
     *
     * @throws SettingValueInvalid
     */
    public function encodeEnum(string $owner, EnumSetting $setting, BackedEnum $value): EncodedValue
    {
        return $value instanceof $setting->enum && $setting->accepts($value->value)
            ? EncodedValue::of($value->value)
            : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    /**
     * The native value of a stored override, of the type its declaration holds.
     *
     * @throws SettingStorageInvalid
     */
    public function decode(string $owner, Setting $setting, EncodedValue $value): string|bool|int|Decimal|BackedEnum
    {
        return match (true) {
            $setting instanceof StringSetting => $this->decodeString($owner, $setting, $value),
            $setting instanceof BooleanSetting => $this->decodeBoolean($owner, $setting, $value),
            $setting instanceof IntegerSetting => $this->decodeInteger($owner, $setting, $value),
            $setting instanceof DecimalSetting => $this->decodeDecimal($owner, $setting, $value),
            $setting instanceof ChoiceSetting => $this->decodeChoice($owner, $setting, $value),
            $setting instanceof EnumSetting => $this->decodeEnum($owner, $setting, $value),
        };
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decodeString(string $owner, StringSetting $setting, EncodedValue $value): string
    {
        return $value->string()->filter($setting->accepts(...))->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decodeBoolean(string $owner, BooleanSetting $setting, EncodedValue $value): bool
    {
        return $value->boolean()->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decodeInteger(string $owner, IntegerSetting $setting, EncodedValue $value): int
    {
        return $value->integer()->filter($setting->accepts(...))->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * Only the canonical text the setting itself would store is accepted: no other scale, no excess digits.
     *
     * @throws SettingStorageInvalid
     */
    public function decodeDecimal(string $owner, DecimalSetting $setting, EncodedValue $value): Decimal
    {
        $invalid = SettingStorageInvalid::for($owner, $setting->key);
        $text = $value->string()->getOrThrow($invalid);

        try {
            $decimal = $setting->normalized(Decimal::parse($text));
        } catch (DecimalInvalid) {
            throw $invalid;
        }

        return $decimal->text === $text ? $decimal : throw $invalid;
    }

    /**
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     *
     * @throws SettingStorageInvalid
     */
    public function decodeChoice(string $owner, ChoiceSetting $setting, EncodedValue $value): string|int
    {
        return $this->choiceValue($value)->filter($setting->accepts(...))->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingStorageInvalid
     */
    public function decodeEnum(string $owner, EnumSetting $setting, EncodedValue $value): BackedEnum
    {
        return $this->choiceValue($value)
            ->filter($setting->accepts(...))
            ->flatMap(fn (string|int $backing) => Option::fromValue($setting->caseOf($backing)))
            ->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * A toggle group's stored state, which only a JSON true or false is.
     *
     * @throws SettingStorageInvalid
     */
    public function decodeToggle(string $owner, ToggleGroup $group, EncodedValue $value): bool
    {
        return $value->boolean()->getOrThrow(SettingStorageInvalid::for($owner, $group->key));
    }

    /**
     * @return Option<string|int>
     */
    private function choiceValue(EncodedValue $value): Option
    {
        return $value->string()->orElse($value->integer());
    }
}
