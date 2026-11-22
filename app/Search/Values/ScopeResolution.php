<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Enums\ScopeAnswer;
use App\Search\Exceptions\SearchableMissing;

/**
 * What a key or label the caller chose resolved to among the sources it may search: the one source, or for an
 * ambiguous or unknown choice at most five eligible alternatives to choose from.
 */
final readonly class ScopeResolution
{
    public const int ALTERNATIVE_LIMIT = 5;

    /**
     * @param  list<DeclaredSearchable>  $sources
     */
    private function __construct(
        public ScopeAnswer $answer,
        public array $sources,
    ) {}

    public static function resolved(DeclaredSearchable $source): self
    {
        return new self(ScopeAnswer::Resolved, [$source]);
    }

    /**
     * @param  list<DeclaredSearchable>  $choices
     */
    public static function ambiguous(array $choices): self
    {
        return new self(ScopeAnswer::Ambiguous, array_slice($choices, 0, self::ALTERNATIVE_LIMIT));
    }

    /**
     * @param  list<DeclaredSearchable>  $alternatives
     */
    public static function unknown(array $alternatives): self
    {
        return new self(ScopeAnswer::Unknown, array_slice($alternatives, 0, self::ALTERNATIVE_LIMIT));
    }

    public function isResolved(): bool
    {
        return $this->answer === ScopeAnswer::Resolved;
    }

    /**
     * The one source a resolved scope names.
     *
     * @throws SearchableMissing
     */
    public function source(): DeclaredSearchable
    {
        if (! $this->isResolved()) {
            throw SearchableMissing::forKey('');
        }

        return $this->sources[0];
    }

    /**
     * The qualified keys of the alternatives, for the caller to choose from.
     *
     * @return list<string>
     */
    public function keys(): array
    {
        return array_map(fn (DeclaredSearchable $source) => $source->qualifiedKey, $this->sources);
    }
}
