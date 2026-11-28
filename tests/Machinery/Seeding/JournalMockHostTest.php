<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;
use App\Values\FeedEntry;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\Hosts\MockHost;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The mock host plays the recorded host's side of a scenario to the journal: it answers the journal's order as the
 * recorded host answered the same order, which binds the recording's ids to the test's, and sends what the recorded
 * host sent about that process; it never refuses an order in a way the recording does not hold.
 */
final class JournalMockHostTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openContainer('probe'));
    }

    public function test_the_recorded_host_reports_and_prints_for_the_tests_own_process(): void
    {
        $this->journal->mockHost('Mac', fn (MockHost $host) => $host
            ->playing('claude-code/terminal-turn')
            ->answers(HostInstructionType::OpenContainer)
            ->sends(HostRoute::NotifyProcessReport)
            ->sends(HostRoute::NotifyProcessOutput, nth: 4));

        $process = $this->journal->hostProcessCalled('probe')->id;
        $entries = $this->journal->service(ProcessFeed::class)->after($process, ProcessFeed::FIRST_CURSOR, 0);

        $this->journal->assertResult(
            "2.1.332 (Claude Code)\n",
            implode('', array_map(fn (FeedEntry $entry) => $entry->printed(), $entries)),
        );
    }

    public function test_a_refusal_the_recording_does_not_hold_fails_the_test(): void
    {
        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('holds no open_container order refused as unsafe');

        $this->journal->mockHost('Mac', fn (MockHost $host) => $host
            ->playing('claude-code/terminal-turn')
            ->refuses(HostInstructionType::OpenContainer, HostRefusal::Unsafe));
    }
}
