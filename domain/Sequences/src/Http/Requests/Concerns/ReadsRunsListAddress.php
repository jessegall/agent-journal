<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests\Concerns;

use App\Exceptions\InvalidActorText;
use App\Support\ActorReference;

/**
 * Reads the runs list's address from a request: the actor whose runs it shows, when one was chosen, and the page.
 */
trait ReadsRunsListAddress
{
    public function hasFollower(): bool
    {
        return $this->filled('actor');
    }

    /**
     * @throws InvalidActorText
     */
    public function follower(): ActorReference
    {
        return ActorReference::fromText($this->string('actor')->toString());
    }

    public function pageNumber(): int
    {
        return $this->integer('page', 1);
    }
}
