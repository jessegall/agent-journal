<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Navigation\PageOption;
use App\Exceptions\InvalidPageDeclaration;

/**
 * A pane menu option that picks one of several named values, starting on one of them.
 */
final readonly class ChoiceOption implements PageOption
{
    /**
     * @param  non-empty-list<PaneChoice>  $choices
     */
    private function __construct(
        public string $key,
        public string $label,
        public array $choices,
        public string $startsOn,
    ) {}

    /**
     * @param  list<PaneChoice>  $choices
     */
    public static function make(string $key, string $label, array $choices, string $startsOn): self
    {
        if ($choices === []) {
            throw InvalidPageDeclaration::optionWithoutChoices($key);
        }

        $choiceKeys = array_map(fn (PaneChoice $choice) => $choice->choiceKey, $choices);

        if (! in_array($startsOn, $choiceKeys, true)) {
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
