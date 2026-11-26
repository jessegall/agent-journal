<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Support\Hosts\ProcessFeed;
use Tests\Support\CommitsHookRows;
use Tests\Support\Hosts\EchoProgramDriver;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The test journal runs a host for real and opens the stand-in's echo program on it, then waits for its report.
 */
final class JournalRealHostTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
        'agents',
        'agent_sessions',
        'agent_runtimes',
        'driver_requests',
        'session_tokens',
    ];

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

    public function test_a_real_host_reaches_its_journal_again_after_the_journal_restarted(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runRealHost('Mac')->restartJournalOfRealHost();

        $this->journal
            ->openEchoContainer('Mac', 'echo')
            ->waitForHostProcess('echo', HostProcessStatus::Running);
    }

    public function test_a_process_opened_with_start_credentials_sees_them_under_their_names(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Probe')->enrollHost('Mac', [base_path()])->runRealHost('Mac');
        $opened = $this->journal->openRuntimeOn('Probe', 'Mac', base_path());
        $seen = tempnam(sys_get_temp_dir(), 'start-credentials-');
        $print = 'printf "%s" "$JOURNAL_START_TOKEN" > "$0"';

        $this->journal
            ->openWithStartCredentials('Mac', 'probe', $opened->runtimeId, ['sh', '-c', $print, $seen])
            ->waitForHostProcess('probe', HostProcessStatus::Exited);

        $this->assertSame(64, strlen((string) file_get_contents($seen)));
    }
}
