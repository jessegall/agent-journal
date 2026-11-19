<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Test user 1 as the current actor, under the owner's authority, from the start of each test.
 */
trait ActsAsFirstUser
{
    use ActsAsActors;

    protected function setUpActsAsFirstUser(): void
    {
        $this->actAsUser(1);
    }
}
