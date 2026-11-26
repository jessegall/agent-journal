<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

/**
 * The shipped skills built into one generation before each test.
 */
trait RefreshesSkills
{
    protected function setUpRefreshesSkills(): void
    {
        $this->journal->refreshSkills();
    }
}
