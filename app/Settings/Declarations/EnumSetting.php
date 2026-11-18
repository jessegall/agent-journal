<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\ChoiceLabel;
use App\Settings\Contracts\Setting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\ChoiceOptions;
use App\Settings\Support\SettingKey;
use App\Settings\Values\Choice;
use BackedEnum;
use Illuminate\Support\Str;
use ReflectionEnum;

/**
 * A setting that holds one case of a backed enum; its options are the cases in order, labelled by the enum when it
 * names them and by the case name otherwise.
 *
 * @template TEnum of BackedEnum
 */
final readonly class EnumSetting implements Setting
{
    /**
     * @param  class-string<TEnum>  $enum
     * @param  TEnum  $default
     * @param  ChoiceOptions<string|int>  $options
     */
    private function __construct(
        public string $key,
        public string $label,
        public string $enum,
        public BackedEnum $default,
        public SettingType $backing,
        public ChoiceOptions $options,
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
    public static function make(string $key, string $label, string $enum, BackedEnum $default): self
    {
        SettingKey::require($key, $label);

        if (! enum_exists($enum) || ! new ReflectionEnum($enum)->isBacked()) {
            throw SettingDeclarationInvalid::notABackedEnum($key);
        }

        if (! $default instanceof $enum) {
            throw SettingDeclarationInvalid::defaultNotAnOption($key);
        }

        $backing = (string) new ReflectionEnum($enum)->getBackingType() === 'int' ? SettingType::Integer : SettingType::String;
        $options = array_map(fn (BackedEnum $case) => self::choiceOf($case), $enum::cases());

        return new self($key, $label, $enum, $default, $backing, ChoiceOptions::check($key, $options, $default->value));
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
     * @return list<Choice<string|int>>
     */
    public function options(): array
    {
        return $this->options->options;
    }

    /**
     * Whether a value is exactly the backing value of one of the cases.
     */
    public function accepts(string|int $value): bool
    {
        return $this->options->contains($value);
    }

    /**
     * The case a stored backing value names, or null when the enum no longer has it.
     *
     * @return TEnum|null
     */
    public function caseOf(string|int $value): BackedEnum|null
    {
        return ($this->enum)::tryFrom($value);
    }

    /**
     * @return Choice<string|int>
     */
    private static function choiceOf(BackedEnum $case): Choice
    {
        return Choice::make($case->value, $case instanceof ChoiceLabel ? $case->label() : Str::headline($case->name));
    }
}
