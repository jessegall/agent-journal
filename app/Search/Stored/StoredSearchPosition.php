<?php

declare(strict_types=1);

namespace App\Search\Stored;

/**
 * One retained position of a search as the cache keeps it: the state it resumes from, and once it has answered, the
 * page it produced and the position that follows it.
 */
final readonly class StoredSearchPosition
{
    public function __construct(
        public string $state,
        public string|null $page = null,
        public string|null $successor = null,
    ) {}

    public function answered(string $page, string $successor): self
    {
        return new self($this->state, $page, $successor);
    }
}
