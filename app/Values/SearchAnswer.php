<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScopeAnswer;
use App\Enums\SearchStatus;

/**
 * What one search call answers: its status, the hits in the one global order, a direct open for a complete
 * reference, the sources to choose from when several recognize it, the continuation to call next, the narrower
 * scopes that avoid a stalled source, and the scope alternatives when the scope could not be used.
 */
final readonly class SearchAnswer
{
    /**
     * @param  list<EmittedHit>  $hits
     * @param  list<string>  $sourceChoices  qualified keys of the sources that recognized the reference
     * @param  list<string>  $narrowerScopes  qualified keys a fresh scoped search may use instead
     */
    public function __construct(
        public SearchStatus $status,
        public array $hits = [],
        public EmittedHit|null $directOpen = null,
        public array $sourceChoices = [],
        public string|null $continuation = null,
        public array $narrowerScopes = [],
        public ScopeResolution|null $scope = null,
    ) {}

    public static function noSources(): self
    {
        return new self(SearchStatus::NoSources);
    }

    public static function restart(): self
    {
        return new self(SearchStatus::Restart);
    }

    public static function forScope(ScopeResolution $scope): self
    {
        $status = $scope->answer === ScopeAnswer::Ambiguous ? SearchStatus::AmbiguousScope : SearchStatus::UnknownScope;

        return new self($status, scope: $scope);
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
        );
    }
}
