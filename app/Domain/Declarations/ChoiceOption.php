<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Contracts\PageOption;
use App\Domain\Exceptions\InvalidPageDeclaration;

/**
 * A pane menu option that picks one of several named values, starting on one of them.
 */
final readonly class ChoiceOption implements PageOption
{
    /**
     * @param  array<string, string>  $choices  each choice's value with its label
     */
    private function __construct(
        private string $key,
        private string $label,
        public array $choices,
        public string $startsOn,
    ) {}

    /**
     * @param  array<string, string>  $choices  each choice's value with its label
     */
    public static function make(string $key, string $label, array $choices, string $startsOn): self
    {
        if ($choices === []) {
            throw InvalidPageDeclaration::optionWithoutChoices($key);
        }

        if (! array_all($choices, fn (mixed $choiceLabel, int|string $value) => is_string($value) && is_string($choiceLabel))) {
            throw InvalidPageDeclaration::choicesNotNamed($key);
        }

        if (! array_key_exists($startsOn, $choices)) {
            throw InvalidPageDeclaration::unknownChoice($key, $startsOn);
        }

        return new self($key, $label, $choices, $startsOn);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }
}
