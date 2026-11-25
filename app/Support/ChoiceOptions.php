<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Settings\CatalogueConstraints;
use App\Contracts\Settings\CatalogueValue;
use App\Data\Settings\IntegerChoiceConstraintsData;
use App\Data\Settings\IntegerChoiceOptionData;
use App\Data\Settings\IntegerChoiceValueData;
use App\Data\Settings\StringChoiceConstraintsData;
use App\Data\Settings\StringChoiceOptionData;
use App\Data\Settings\StringChoiceValueData;
use App\Declarations\IntegerSetting;
use App\Exceptions\SettingDeclarationInvalid;
use App\Values\Choice;
use App\Values\Decimal;
use BackedEnum;

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

        $optionCatalog = [];

        foreach ($options as $option) {
            if (get_debug_type($option->optionKey) !== get_debug_type($default)) {
                throw SettingDeclarationInvalid::mixedOptionTypes($key);
            }

            if (is_int($option->optionKey)
                && ($option->optionKey < IntegerSetting::SMALLEST || $option->optionKey > IntegerSetting::LARGEST)) {
                throw SettingDeclarationInvalid::badBounds($key);
            }

            if (in_array($option->optionKey, $optionCatalog, true)) {
                throw SettingDeclarationInvalid::optionTwice($key);
            }

            $optionCatalog[] = $option->optionKey;
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
    public function contains(string|int $optionKey): bool
    {
        foreach ($this->options as $option) {
            if ($option->optionKey === $optionKey) {
                return true;
            }
        }

        return false;
    }

    /**
     * A choice value as the catalogue shows it: a whole-number choice or a text choice.
     */
    public static function valueData(string|bool|int|Decimal|BackedEnum $optionKey): CatalogueValue
    {
        if (is_int($optionKey)) {
            return IntegerChoiceValueData::from(['value' => $optionKey]);
        }

        return StringChoiceValueData::from(['value' => $optionKey]);
    }

    /**
     * The options as the catalogue shows them, each with its value and label.
     *
     * @param  list<Choice<string|int>>  $options
     */
    public static function constraintsData(array $options): CatalogueConstraints
    {
        $shown = array_map(fn (Choice $option) => [
            'value' => $option->optionKey,
            'label' => $option->label,
        ], $options);

        if (is_int($options[0]->optionKey)) {
            return IntegerChoiceConstraintsData::from(['options' => IntegerChoiceOptionData::collect($shown)]);
        }

        return StringChoiceConstraintsData::from(['options' => StringChoiceOptionData::collect($shown)]);
    }
}
