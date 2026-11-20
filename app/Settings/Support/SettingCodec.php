<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\OptionSetting;
use App\Settings\Contracts\Setting;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\DecimalInvalid;
use App\Settings\Exceptions\SettingHandleUnknown;
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
    public function encodeString(string $owner, StringSetting $setting, string $input): EncodedValue
    {
        return $setting->accepts($input)
            ? EncodedValue::of($input)
            : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    public function encodeBoolean(bool $input): EncodedValue
    {
        return EncodedValue::of($input);
    }

    /**
     * @throws SettingValueInvalid
     */
    public function encodeInteger(string $owner, IntegerSetting $setting, int $input): EncodedValue
    {
        return $setting->accepts($input)
            ? EncodedValue::of($input)
            : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    /**
     * Stores the value written at the setting's scale, as its canonical text.
     *
     * @throws SettingValueInvalid
     */
    public function encodeDecimal(string $owner, DecimalSetting $setting, Decimal $input): EncodedValue
    {
        try {
            return EncodedValue::of($setting->normalized($input)->text);
        } catch (DecimalInvalid $cause) {
            throw SettingValueInvalid::for($owner, $setting->key, $setting->type(), previous: $cause);
        }
    }

    /**
     * Stores an option of a choice or enum setting, which must be exactly one of its options.
     *
     * @throws SettingValueInvalid
     */
    public function encodeOption(string $owner, OptionSetting $setting, string|int $input): EncodedValue
    {
        return $setting->accepts($input)
            ? EncodedValue::of($input)
            : throw SettingValueInvalid::for($owner, $setting->key(), $setting->type());
    }

    /**
     * Stores the case's backing value.
     *
     * @param  EnumSetting<BackedEnum>  $setting
     *
     * @throws SettingValueInvalid
     */
    public function encodeEnum(string $owner, EnumSetting $setting, BackedEnum $input): EncodedValue
    {
        return $input instanceof $setting->enum && $setting->accepts($input->value)
            ? EncodedValue::of($input->value)
            : throw SettingValueInvalid::for($owner, $setting->key, $setting->type());
    }

    /**
     * The native value of a stored override, of the type its declaration holds.
     *
     * @throws SettingStorageInvalid
     * @throws SettingHandleUnknown for a declaration class outside the settings types
     */
    public function decode(
        string $owner,
        Setting $setting,
        EncodedValue $input,
    ): string|bool|int|Decimal|BackedEnum {
        return match (true) {
            $setting instanceof StringSetting => $this->decodeString($owner, $setting, $input),
            $setting instanceof BooleanSetting => $this->decodeBoolean($owner, $setting, $input),
            $setting instanceof IntegerSetting => $this->decodeInteger($owner, $setting, $input),
            $setting instanceof DecimalSetting => $this->decodeDecimal($owner, $setting, $input),
            $setting instanceof ChoiceSetting => $this->decodeChoice($owner, $setting, $input),
            $setting instanceof EnumSetting => $this->decodeEnum($owner, $setting, $input),
            default => throw SettingHandleUnknown::for($setting::class, $setting->key()),
        };
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decodeString(string $owner, StringSetting $setting, EncodedValue $input): string
    {
        return $input->string()->filter($setting->accepts(...))->getOrThrow(
            SettingStorageInvalid::for($owner, $setting->key),
        );
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decodeBoolean(string $owner, BooleanSetting $setting, EncodedValue $input): bool
    {
        return $input->boolean()->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * @throws SettingStorageInvalid
     */
    public function decodeInteger(string $owner, IntegerSetting $setting, EncodedValue $input): int
    {
        return $input->integer()->filter($setting->accepts(...))->getOrThrow(
            SettingStorageInvalid::for($owner, $setting->key),
        );
    }

    /**
     * Only the canonical text the setting itself would store is accepted: no other scale, no excess digits.
     *
     * @throws SettingStorageInvalid
     */
    public function decodeDecimal(string $owner, DecimalSetting $setting, EncodedValue $input): Decimal
    {
        $invalid = SettingStorageInvalid::for($owner, $setting->key);
        $text = $input->string()->getOrThrow($invalid);

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
    public function decodeChoice(string $owner, ChoiceSetting $setting, EncodedValue $input): string|int
    {
        /**
         * @var TValue $option one of the setting's own options, which accepts() just checked by exact type
         */
        $option = $this->choiceValue($input)->filter($setting->accepts(...))->getOrThrow(
            SettingStorageInvalid::for($owner, $setting->key),
        );

        return $option;
    }

    /**
     * @template TEnum of BackedEnum
     *
     * @param  EnumSetting<TEnum>  $setting
     * @return TEnum
     *
     * @throws SettingStorageInvalid
     */
    public function decodeEnum(string $owner, EnumSetting $setting, EncodedValue $input): BackedEnum
    {
        return $this->choiceValue($input)
            ->filter($setting->accepts(...))
            ->flatMap(fn (string|int $backing) => Option::fromValue($setting->caseOf($backing)))
            ->getOrThrow(SettingStorageInvalid::for($owner, $setting->key));
    }

    /**
     * A toggle group's stored state, which only a JSON true or false is.
     *
     * @throws SettingStorageInvalid
     */
    public function decodeToggle(string $owner, ToggleGroup $group, EncodedValue $input): bool
    {
        return $input->boolean()->getOrThrow(SettingStorageInvalid::for($owner, $group->key));
    }

    /**
     * @return Option<string|int>
     */
    private function choiceValue(EncodedValue $input): Option
    {
        return $input->string()->orElse($input->integer());
    }
}
