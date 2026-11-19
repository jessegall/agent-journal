<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Makes test user 7 the current actor, with the owner's authority, before each test.
 */
trait ActsAsTestUser
{
    use ActsAsActors;

    protected function setUpActsAsTestUser(): void
    {
        $this->actAs(TestActors::user(7));
    }
}
