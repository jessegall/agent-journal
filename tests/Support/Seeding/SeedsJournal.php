<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

/**
 * Gives a test its journal seed: one per test, made on first use.
 */
trait SeedsJournal
{
    private JournalSeed|null $journalSeed = null;

    protected function journal(): JournalSeed
    {
        return $this->journalSeed ??= new JournalSeed($this->app);
    }
}
