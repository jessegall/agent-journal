<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Makes the journal's owner before each test and starts a user's request as them.
 */
trait StartsOwnerRequest
{
    use ActsAsOwner;
    use StartsAgentRequests;

    protected function setUpStartsOwnerRequest(): void
    {
        $this->setUpActsAsOwner();
        $this->startUserRequestAs($this->owner->id);
    }
}
