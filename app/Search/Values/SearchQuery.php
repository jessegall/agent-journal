<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Exceptions\SearchValueInvalid;

/**
 * What one provider call is asked: who reads, the words, the scope the caller chose, the source being asked, how
 * many hits it may return, the work it may still do and where it stopped last time, when it has run before.
 * RefreshCandidates is the variant that rereads hits the search already holds.
 */
readonly class SearchQuery
{
    public const int HIT_LIMIT = 51;

    /**
     * @throws SearchValueInvalid
     */
    public function __construct(
        public SearchReader $reader,
        public SearchWords $words,
        public SearchScope $scope,
        public string $sourceKey,
        public int $pageAllowance,
        public WorkBudget $budget,
        public SourcePosition|null $position = null,
    ) {
        if ($pageAllowance < 1 || $pageAllowance > self::HIT_LIMIT) {
            throw SearchValueInvalid::outOfRange('page allowance', 1, self::HIT_LIMIT);
        }
    }

    /**
     * The same query, resumed from the position the source reported last.
     */
    public function from(SourcePosition $position): self
    {
        return new self(
            $this->reader,
            $this->words,
            $this->scope,
            $this->sourceKey,
            $this->pageAllowance,
            $this->budget,
            $position,
        );
    }

    /**
     * @param  list<HitIdentity>  $candidates
     */
    public function refreshing(array $candidates): RefreshCandidates
    {
        return new RefreshCandidates($this, $candidates);
    }
}
