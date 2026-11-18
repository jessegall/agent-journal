<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Declarations\IntegerSetting;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Values\Choice;

/**
 * The options of a choice setting in declaration order, checked once: not empty, at most MOST options, every value of
 * the default's type, no value twice (compared exactly, so '01' and '1' differ), whole numbers within the exact range,
 * and the default among them.
 *
 * @template-covariant TValue of string|int
 */
final readonly class ChoiceOptions
{
    public const int MOST = 500;

    /**
     * @param  list<Choice<TValue>>  $options
     */
    private function __construct(public array $options) {}

    /**
     * @template TOption of string|int
     *
     * @param  list<Choice<TOption>>  $options
     * @param  TOption  $default
     * @return self<TOption>
     *
     * @throws SettingDeclarationInvalid
     */
    public static function check(string $key, array $options, string|int $default): self
    {
        if ($options === [] || count($options) > self::MOST) {
            throw SettingDeclarationInvalid::badOptionCount($key, self::MOST);
        }

        $values = [];

        foreach ($options as $option) {
            if (get_debug_type($option->value) !== get_debug_type($default)) {
                throw SettingDeclarationInvalid::mixedOptionTypes($key);
            }

            if (is_int($option->value) && ($option->value < IntegerSetting::SMALLEST || $option->value > IntegerSetting::LARGEST)) {
                throw SettingDeclarationInvalid::badBounds($key);
            }

            if (in_array($option->value, $values, true)) {
                throw SettingDeclarationInvalid::optionTwice($key);
            }

            $values[] = $option->value;
        }

        $checked = new self($options);

        if (! $checked->contains($default)) {
            throw SettingDeclarationInvalid::defaultNotAnOption($key);
        }

        return $checked;
    }

    /**
     * Whether one option has exactly this value.
     */
    public function contains(string|int $value): bool
    {
        foreach ($this->options as $option) {
            if ($option->value === $value) {
                return true;
            }
        }

        return false;
    }
}
