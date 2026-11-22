<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScopeAnswer;
use App\Exceptions\SearchableMissing;

/**
 * What a key or label the caller chose resolved to among the sources it may search: the one source, or for an
 * ambiguous or unknown choice at most five eligible alternatives to choose from.
 */
final readonly class ScopeResolution
{
    public const int ALTERNATIVE_LIMIT = 5;

    /**
     * The search arguments that page every source the caller may search, offered beside an unresolved answer.
     */
    public const array DISCOVERY_ACTION = ['discover' => true, 'prefix' => ''];

    /**
     * @param  list<DeclaredSearchable>  $sources
     */
    private function __construct(
        public ScopeAnswer $answer,
        public array $sources,
    ) {}

    public static function everywhere(): self
    {
        return new self(ScopeAnswer::Everywhere, []);
    }

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
     * Whether the answer offers the discovery action: an ambiguous or unknown scope does.
     */
    public function offersDiscovery(): bool
    {
        return ! $this->answer->admitsSearch();
    }

    /**
     * The scope a search runs over on this answer.
     *
     * @throws SearchableMissing
     */
    public function searchScope(): SearchScope
    {
        if ($this->answer === ScopeAnswer::Everywhere) {
            return SearchScope::everywhere();
        }

        return SearchScope::within($this->source()->qualifiedKey);
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

    /**
     * The alternatives as a person reads them, such as Tasks (tasks.task).
     *
     * @return list<string>
     */
    public function displays(): array
    {
        return array_map(fn (DeclaredSearchable $source) => $source->display(), $this->sources);
    }
}
