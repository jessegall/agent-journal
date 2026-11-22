<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScopeAnswer;
use App\Enums\SearchStatus;

/**
 * What one search call answers: its status, the hits in the one global order, a direct open for a complete
 * reference, the sources to choose from when several recognize it, the continuation to call next, the narrower
 * scopes that avoid a stalled source with the words to search them for, and the scope alternatives when the scope
 * could not be used.
 */
final readonly class SearchAnswer
{
    /**
     * @param  list<EmittedHit>  $hits
     * @param  list<string>  $sourceChoices  qualified keys of the sources that recognized the reference
     * @param  list<string>  $narrowerScopes  qualified keys a fresh scoped search may use instead
     * @param  list<string>  $failedSources  qualified keys of the sources whose batch the search could not use
     */
    public function __construct(
        public SearchStatus $status,
        public array $hits = [],
        public EmittedHit|null $directOpen = null,
        public array $sourceChoices = [],
        public string|null $continuation = null,
        public array $narrowerScopes = [],
        public ScopeResolution|null $scope = null,
        public string|null $words = null,
        public string|null $reason = null,
        public array $failedSources = [],
    ) {}

    public static function noSources(): self
    {
        return new self(SearchStatus::NoSources);
    }

    public static function restart(): self
    {
        return new self(SearchStatus::Restart);
    }

    /**
     * Not even one hit with its open action fits an answer: a terminal outcome, with no continuation to repeat.
     */
    public static function resultTooLarge(): self
    {
        return new self(
            SearchStatus::ResultTooLarge,
            reason: 'A matching hit is too large to show; search with words that name it more closely.',
        );
    }

    public static function forScope(ScopeResolution $scope): self
    {
        $status = $scope->answer === ScopeAnswer::Ambiguous ? SearchStatus::AmbiguousScope : SearchStatus::UnknownScope;

        return new self($status, scope: $scope);
    }

    /**
     * The fresh scoped searches an incomplete answer offers: the same words within each narrower scope.
     *
     * @return list<array{query: string, within: string}>
     */
    public function narrowerSearches(): array
    {
        if ($this->words === null) {
            return [];
        }

        return array_map(fn (string $key) => ['query' => $this->words, 'within' => $key], $this->narrowerScopes);
    }

    /**
     * @param  list<string>  $sources
     */
    public function withFailedSources(array $sources): self
    {
        return new self(
            $this->status,
            $this->hits,
            $this->directOpen,
            $this->sourceChoices,
            $this->continuation,
            $this->narrowerScopes,
            $this->scope,
            $this->words,
            $this->reason,
            $sources,
        );
    }

    public function withContinuation(string|null $continuation): self
    {
        return new self(
            $this->status,
            $this->hits,
            $this->directOpen,
            $this->sourceChoices,
            $continuation,
            $this->narrowerScopes,
            $this->scope,
            $this->words,
            $this->reason,
            $this->failedSources,
        );
    }
}
