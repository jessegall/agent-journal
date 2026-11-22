<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\Searchable;

/**
 * A searchable as the registry published it: the domain that owns it, its qualified key such as tasks.task, and
 * the declaration itself.
 */
final readonly class DeclaredSearchable
{
    public function __construct(
        public string $owner,
        public string $qualifiedKey,
        public Searchable $searchable,
    ) {}

    public function label(): string
    {
        return $this->searchable->label;
    }

    /**
     * The source as a person reads it: Tasks (tasks.task).
     */
    public function display(): string
    {
        return "{$this->searchable->label} ({$this->qualifiedKey})";
    }

    public function hasLabel(string $input): bool
    {
        return SearchWords::fold(trim($input)) === SearchWords::fold($this->searchable->label);
    }

    /**
     * Whether its key, or its label in folded form, starts with the prefix.
     */
    public function startsWith(string $prefix): bool
    {
        return str_starts_with($this->qualifiedKey, $prefix)
            || str_starts_with(SearchWords::fold($this->searchable->label), SearchWords::fold($prefix));
    }
}
