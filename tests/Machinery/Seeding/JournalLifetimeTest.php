<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * Every test case holds one journal for its application: the same one on each read, kept through a request reset
 * and made anew when the application is.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalLifetimeTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_journal_is_one_per_application_and_outlives_a_request_reset(): void
    {
        $journal = $this->journal->owner();

        $this->app->forgetScopedInstances();

        $this->assertSame($journal, $this->journal);
        $this->assertSame('Owner', $this->journal->ownerUser()->name);
    }

    public function test_a_fresh_application_gets_a_fresh_journal(): void
    {
        $before = $this->journal;

        $this->refreshApplication();

        $this->assertNotSame($before, $this->journal);
    }
}
