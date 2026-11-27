<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Enums\SearchRequestType;
use App\Search\Exceptions\SearchRequestInvalid;
use App\Search\Exceptions\SearchWordsInvalid;

/**
 * One search the caller asked for, checked before any source runs: fresh words with an optional scope, a
 * continuation of an earlier search, or a discovery page of the sources it may search. Every refusal happens here,
 * so a refused request reads nothing.
 */
final readonly class SearchRequest
{
    public const int DEFAULT_LIMIT = 10;

    public const int LIMIT_MAXIMUM = 50;

    private function __construct(
        public SearchRequestType $type,
        public SearchWords|null $words,
        public string|null $within,
        public int $limit,
        public string|null $continuation,
        public string|null $prefix,
    ) {}

    /**
     * @throws SearchRequestInvalid
     * @throws SearchWordsInvalid
     */
    public static function parse(
        string|null $query = null,
        string|null $within = null,
        int|null $limit = null,
        string|null $continuation = null,
        bool $shouldDiscover = false,
        string|null $prefix = null,
    ): self {
        $checkedLimit = self::checkedLimit($limit);

        if ($continuation !== null) {
            return self::continuing($continuation, $query, $within, $shouldDiscover, $checkedLimit);
        }

        if ($shouldDiscover) {
            if ($query !== null) {
                throw SearchRequestInvalid::conflicting('discover', 'query');
            }

            if ($within !== null) {
                throw SearchRequestInvalid::conflicting('discover', 'within');
            }

            $discoveryPrefix = $prefix === null ? '' : trim($prefix);

            return new self(SearchRequestType::Discovery, null, null, $checkedLimit, null, $discoveryPrefix);
        }

        if ($query === null) {
            throw SearchRequestInvalid::withoutWords();
        }

        if ($within !== null && trim($within) === '') {
            throw SearchRequestInvalid::blankScope();
        }

        $scope = $within === null ? null : trim($within);

        return new self(SearchRequestType::Fresh, SearchWords::fromInput($query), $scope, $checkedLimit, null, null);
    }

    public function isFresh(): bool
    {
        return $this->type === SearchRequestType::Fresh;
    }

    public function isDiscovery(): bool
    {
        return $this->type === SearchRequestType::Discovery;
    }

    public function continues(): bool
    {
        return $this->type === SearchRequestType::Continuation;
    }

    /**
     * The prefix a discovery request lists the sources by.
     *
     * @throws SearchRequestInvalid
     */
    public function discoveryPrefix(): string
    {
        if ($this->prefix === null) {
            throw SearchRequestInvalid::withoutWords();
        }

        return $this->prefix;
    }

    /**
     * The handle a continuation request carries.
     *
     * @throws SearchRequestInvalid
     */
    public function continuationHandle(): string
    {
        if ($this->continuation === null) {
            throw SearchRequestInvalid::withoutWords();
        }

        return $this->continuation;
    }

    /**
     * @throws SearchRequestInvalid
     */
    private static function continuing(
        string $continuation,
        string|null $query,
        string|null $within,
        bool $shouldDiscover,
        int $limit,
    ): self {
        if ($query !== null) {
            throw SearchRequestInvalid::conflicting('continuation', 'query');
        }

        if ($within !== null) {
            throw SearchRequestInvalid::conflicting('continuation', 'within');
        }

        if ($shouldDiscover) {
            throw SearchRequestInvalid::conflicting('continuation', 'discover');
        }

        return new self(SearchRequestType::Continuation, null, null, $limit, $continuation, null);
    }

    /**
     * @throws SearchRequestInvalid
     */
    private static function checkedLimit(int|null $limit): int
    {
        if ($limit === null) {
            return self::DEFAULT_LIMIT;
        }

        if ($limit < 1 || $limit > self::LIMIT_MAXIMUM) {
            throw SearchRequestInvalid::limitOutOfRange(1, self::LIMIT_MAXIMUM);
        }

        return $limit;
    }
}
