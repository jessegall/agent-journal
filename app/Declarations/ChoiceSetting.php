<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Settings\CatalogueConstraints;
use App\Contracts\Settings\CatalogueValue;
use App\Contracts\Settings\OptionSetting;
use App\Enums\SettingType;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\ChoiceOptions;
use App\Support\SettingKey;
use App\Values\Choice;
use App\Values\Decimal;
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
     * @param  TValue  $defaultValue
     * @param  ChoiceOptions<TValue>  $options
     */
    private function __construct(
        public string $key,
        public string $label,
        public string|int $defaultValue,
        public ChoiceOptions $options,
        public string|null $description = null,
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
    public static function make(
        string $key,
        string $label,
        string|int $default,
        array $options,
        string|null $description = null,
    ): self {
        SettingKey::require($key, $label);

        return new self($key, $label, $default, ChoiceOptions::check($key, $options, $default), $description);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }

    /**
     * The sentence the settings page shows under the label; null when the label says it all.
     */
    public function description(): string|null
    {
        return $this->description;
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
    public function accepts(string|int $input): bool
    {
        return $this->options->contains($input);
    }

    public function isEnabledByDefault(): string|int
    {
        return $this->defaultValue;
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $input): CatalogueValue
    {
        return ChoiceOptions::valueData($input);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return ChoiceOptions::constraintsData($this->options());
    }
}
