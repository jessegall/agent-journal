<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Actors\ChoiceLabel;
use App\Contracts\Settings\CatalogueConstraints;
use App\Contracts\Settings\CatalogueValue;
use App\Contracts\Settings\OptionSetting;
use App\Enums\Settings\SettingType;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\ChoiceOptions;
use App\Support\ReflectedType;
use App\Support\SettingKey;
use App\Values\Choice;
use App\Values\Decimal;
use BackedEnum;
use Illuminate\Support\Str;
use Spatie\LaravelData\Optional;

/**
 * A setting that holds one case of a backed enum; its options are the cases in order, labelled by the enum when it
 * names them and by the case name otherwise.
 *
 * @template TEnum of BackedEnum
 */
final readonly class EnumSetting implements OptionSetting
{
    /**
     * @param  class-string<TEnum>  $enum
     * @param  TEnum  $defaultValue
     * @param  ChoiceOptions<string|int>  $options
     */
    private function __construct(
        public string $key,
        public string $label,
        public string $enum,
        public BackedEnum $defaultValue,
        public SettingType $backing,
        public ChoiceOptions $options,
        public string|null $description = null,
    ) {}

    /**
     * @template TCase of BackedEnum
     *
     * @param  class-string<TCase>  $enum
     * @param  TCase  $default
     * @return self<TCase>
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(
        string $key,
        string $label,
        string $enum,
        BackedEnum $default,
        string|null $description = null,
    ): self {
        SettingKey::require($key, $label);

        $type = ReflectedType::of($enum);

        if ($type->backingType()->isEmpty()) {
            throw SettingDeclarationInvalid::notABackedEnum($key);
        }

        if ($type->asInstance($default)->isEmpty()) {
            throw SettingDeclarationInvalid::defaultNotAnOption($key);
        }

        $backing = $type->backingType()->get() === 'int'
            ? SettingType::Integer
            : SettingType::String;

        $options = array_map(fn (BackedEnum $case) => self::choiceOf($case), $enum::cases());

        return new self(
            $key,
            $label,
            $enum,
            $default,
            $backing,
            ChoiceOptions::check($key, $options, $default->value),
            $description,
        );
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
     * @return list<Choice<string|int>>
     */
    public function options(): array
    {
        return $this->options->options;
    }

    /**
     * Whether a value is exactly the backing value of one of the cases.
     */
    public function accepts(string|int $input): bool
    {
        return $this->options->contains($input);
    }

    /**
     * The case a stored backing value names, or null when the enum no longer has it.
     *
     * @return TEnum|null
     */
    public function caseOf(string|int $input): BackedEnum|null
    {
        return ($this->enum)::tryFrom($input);
    }

    /**
     * @return Choice<string|int>
     */
    private static function choiceOf(BackedEnum $case): Choice
    {
        return Choice::make($case->value, $case instanceof ChoiceLabel ? $case->label() : Str::headline($case->name));
    }

    public function isEnabledByDefault(): BackedEnum
    {
        return $this->defaultValue;
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $input): CatalogueValue
    {
        return ChoiceOptions::valueData($input instanceof BackedEnum ? $input->value : $input);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return ChoiceOptions::constraintsData($this->options());
    }
}
