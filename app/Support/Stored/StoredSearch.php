<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Exceptions\SearchRestartRequired;

/**
 * One search as the cache keeps it: the hash of the owner it is bound to, its retained positions oldest first, and
 * each position by its id.
 */
final readonly class StoredSearch
{
    /**
     * @param  list<string>  $order
     * @param  array<string, StoredSearchPosition>  $positions
     */
    public function __construct(
        public string $ownerHash,
        public array $order,
        public array $positions,
    ) {}

    public static function starting(string $ownerHash, string $positionId, string $state): self
    {
        return new self($ownerHash, [$positionId], [$positionId => new StoredSearchPosition($state)]);
    }

    public function isOwnedBy(string $ownerHash): bool
    {
        return hash_equals($this->ownerHash, $ownerHash);
    }

    /**
     * @throws SearchRestartRequired
     */
    public function position(string $positionId): StoredSearchPosition
    {
        if (! isset($this->positions[$positionId])) {
            throw SearchRestartRequired::expired();
        }

        return $this->positions[$positionId];
    }

    /**
     * The search after a position answered with its page, its successor starting from the given state; only the
     * newest positions up to the limit are kept.
     *
     * @throws SearchRestartRequired
     */
    public function advanced(
        string $positionId,
        string $page,
        string $successorId,
        string $successorState,
        int $retainedLimit,
    ): self {
        $positions = [
            ...$this->positions,
            $positionId => $this->position($positionId)->answered($page, $successorId),
            $successorId => new StoredSearchPosition($successorState),
        ];
        $order = [...$this->order, $successorId];

        while (count($order) > $retainedLimit) {
            unset($positions[array_shift($order)]);
        }

        return new self($this->ownerHash, $order, $positions);
    }
}
