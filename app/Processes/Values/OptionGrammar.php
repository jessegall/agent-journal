<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\OperandType;

/**
 * One option a declared command accepts, under all its spellings (-D, --delete): a flag, or an option that takes
 * one value of a type, written as its next word or after = in the long form.
 */
final readonly class OptionGrammar
{
    /**
     * @param  list<string>  $names
     * @param  list<OperandType>  $value  empty for a flag, one type for an option that takes a value
     */
    private function __construct(public array $names, public array $value, public bool $isRequired) {}

    public static function flag(string ...$names): self
    {
        return new self(array_values($names), [], false);
    }

    public static function valued(OperandType $type, string ...$names): self
    {
        return new self(array_values($names), [$type], false);
    }

    /**
     * @return array{names: list<string>, value: list<string>, required: bool}
     */
    public function toArray(): array
    {
        return [
            'names' => $this->names,
            'value' => array_map(fn (OperandType $type): string => $type->value, $this->value),
            'required' => $this->isRequired,
        ];
    }

    /**
     * @param  array{names: list<string>, value: list<string>, required: bool}  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self($fields['names'], array_map(OperandType::from(...), $fields['value']), $fields['required']);
    }

    public function required(): self
    {
        return new self($this->names, $this->value, true);
    }

    public function takesValue(): bool
    {
        return $this->value !== [];
    }

    /**
     * Whether the word is this option: one of its names, or a long name with its value after =.
     */
    public function matches(string $word): bool
    {
        if (in_array($word, $this->names, true)) {
            return true;
        }

        return $this->takesValue() && array_any(
            $this->names,
            fn (string $name): bool => str_starts_with($name, '--') && str_starts_with($word, "{$name}="),
        );
    }

    /**
     * Whether the word holds the option and its value together, so no next word is taken.
     */
    public function carriesValue(string $word): bool
    {
        return $this->takesValue() && ! in_array($word, $this->names, true);
    }

    /**
     * Whether the word is the option's own name and its value is the next word.
     */
    public function takesNextWord(string $word): bool
    {
        return $this->takesValue() && in_array($word, $this->names, true);
    }

    public function sharesNameWith(self $other): bool
    {
        return array_intersect($this->names, $other->names) !== [];
    }
}
