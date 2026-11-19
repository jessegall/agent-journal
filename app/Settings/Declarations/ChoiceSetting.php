<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\CatalogueConstraints;
use App\Settings\Contracts\CatalogueValue;
use App\Settings\Contracts\OptionSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\ChoiceOptions;
use App\Settings\Support\SettingKey;
use App\Settings\Values\Choice;
use App\Settings\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * A setting that holds one of a fixed list of options, in the order declared; every option and the default are all
 * text or all whole numbers.
 *
 * @template-covariant TValue of string|int
 */
final readonly class ChoiceSetting implements OptionSetting
{
    /**
     * @param  TValue  $default
     * @param  ChoiceOptions<TValue>  $options
     */
    private function __construct(
        public string $key,
        public string $label,
        public string|int $default,
        public ChoiceOptions $options,
    ) {}

    /**
     * @template TOption of string|int
     *
     * @param  TOption  $default
     * @param  list<Choice<TOption>>  $options
     * @return self<TOption>
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, string|int $default, array $options): self
    {
        SettingKey::require($key, $label);

        return new self($key, $label, $default, ChoiceOptions::check($key, $options, $default));
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }

    public function type(): SettingType
    {
        return SettingType::Choice;
    }

    /**
     * @return list<Choice<TValue>>
     */
    public function options(): array
    {
        return $this->options->options;
    }

    /**
     * Whether a value is exactly one of the options; a value of the other type never is.
     */
    public function accepts(string|int $value): bool
    {
        return $this->options->contains($value);
    }

    public function defaultValue(): string|int
    {
        return $this->default;
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $value): CatalogueValue
    {
        return ChoiceOptions::valueData($value);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return ChoiceOptions::constraintsData($this->options());
    }
}
