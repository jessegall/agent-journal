<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SearchRestartRequired;

/**
 * One retained position of a search as a resume reads it: the private state the next page starts from and, when
 * this position was already resumed, the page it produced and the handle of its successor, to replay unchanged.
 */
final readonly class SearchPosition
{
    public function __construct(
        public string $handle,
        public string $state,
        public string|null $page,
        public string|null $successor,
    ) {}

    public function wasResumed(): bool
    {
        return $this->page !== null && $this->successor !== null;
    }

    /**
     * The page this position produced when it was resumed before; a position never resumed has none to replay.
     *
     * @throws SearchRestartRequired
     */
    public function replayedPage(): string
    {
        if ($this->page === null) {
            throw SearchRestartRequired::expired();
        }

        return $this->page;
    }
}
