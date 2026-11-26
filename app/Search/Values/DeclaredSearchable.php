<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Records\Contracts\ReferenceRecognizer;
use App\Search\Contracts\SearchProvider;
use App\Support\Searchable;
use Illuminate\Contracts\Container\Container;

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

    /**
     * The provider that searches this source, built when a search reaches it.
     */
    public function provider(Container $container): SearchProvider
    {
        return $this->searchable->providerFrom($container);
    }

    /**
     * The recognizer of this source's complete references, when it declares one.
     */
    public function recognizer(Container $container): ReferenceRecognizer|null
    {
        return $this->searchable->recognizerFrom($container);
    }

    public function label(): string
    {
        return $this->searchable->label;
    }

    /**
     * The source as the user reads it: Tasks (tasks.task).
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
