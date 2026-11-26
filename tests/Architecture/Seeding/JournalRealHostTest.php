<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Support\Hosts\ProcessFeed;
use Tests\Support\CommitsHookRows;
use Tests\Support\Hosts\EchoProgramDriver;
use Tests\TestCase;

/**
 * The test journal runs a host for real and opens the stand-in's echo program on it, then waits for its report.
 */
final class JournalRealHostTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['hosts', 'host_processes', 'host_orders'];

    public function test_a_real_host_opens_the_echo_program_the_journal_orders(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProgramDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->openEchoContainer('Mac', 'echo')
            ->waitForHostProcess('echo', HostProcessStatus::Running);
        $process = $this->journal->hostProcessCalled('echo')->id;
        $feed = $this->journal->service(ProcessFeed::class);

        $this->journal->driveHostProcess('echo', fn () => $feed->latestFrame($process) !== null);
        $this->journal->restartRealHost()->waitForHostProcess('echo', HostProcessStatus::Running);

        $this->assertNotSame('', $this->journal->hostProcessCalled('echo')->execution_identity);
    }
}
