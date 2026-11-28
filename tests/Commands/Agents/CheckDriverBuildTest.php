<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CheckDriverBuild\CheckDriverBuildCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Enums\SessionProcessStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Hosts\HostProcess;
use App\Support\Recordings\Recordings;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Recordings\RecordedProgram;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The pinned build a probe printed has the account's sign-in probed next; any other build ends the start stopped with
 * the pinned-build refusal.
 */
#[TestsCommand(CheckDriverBuildCommand::class)]
final class CheckDriverBuildTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'session_requests',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_only_the_pinned_build_lets_the_start_go_on(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Pinned')
            ->idleAgent('Other')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Pinned', fn (TestAgent $pinned) => $pinned->openRuntime('Mac', base_path()));
        $pinned = $this->journal->openedRuntimeOf('Pinned');
        $this->journal->withAgent('Other', fn (TestAgent $other) => $other->openRuntime('Mac', base_path()));
        $other = $this->journal->openedRuntimeOf('Other');
        $version = $this->recordedVersion();

        $this->probeExited('Pinned', 'pinned-probe')
            ->asSystem(new CheckDriverBuildCommand($this->probeOf($pinned->sessionId), $version));
        $build = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->build();
        $otherVersion = str_replace($build, '9.9.9', $version);
        $this->probeExited('Other', 'other-probe')
            ->asSystem(new CheckDriverBuildCommand($this->probeOf($other->sessionId), $otherVersion));

        $refused = $this->journal->startOfSession($other->sessionId);
        $this->journal->withAgent('Pinned', fn (TestAgent $pinned) => $pinned
            ->nameProcess('sign-in', HostProcessPurpose::SignInProbe));
        $this->journal->assertResult(
            [
                SessionProcessStatus::Starting,
                [
                    '{host:INSTALLATION}/bin/claude',
                    'auth',
                    'status',
                    '--json',
                ],
                SessionProcessStatus::Stopped,
                true,
            ],
            [
                $this->journal->startOfSession($pinned->sessionId)->status,
                $this->journal->payloadOf($this->journal->hostInstructionsOf('sign-in')[0])['argv'],
                $refused->status,
                str_contains((string) $refused->refusal, 'is not the proven build'),
            ],
        );
    }

    public function test_a_container_the_session_may_not_run_ends_the_start_with_its_reason(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Boxed')
            ->enrollContainedHost('Box', [base_path()])
            ->readyDriverImagesOn('Box');
        $this->journal->withAgent('Boxed', fn (TestAgent $boxed) => $boxed->openRuntime('Box', base_path()));
        $boxed = $this->journal->openedRuntimeOf('Boxed');
        $this->probeExited('Boxed', 'boxed-probe')
            ->forgetSecurityProfiles()
            ->asSystem(new CheckDriverBuildCommand($this->probeOf($boxed->sessionId), $this->recordedVersion()));

        $refused = $this->journal->startOfSession($boxed->sessionId);
        $this->journal->assertResult(
            [SessionProcessStatus::Stopped, true],
            [$refused->status, str_contains((string) $refused->refusal, 'outside the profiles folder')],
        );
    }

    public function test_a_probe_the_host_could_not_run_ends_the_start_with_the_hosts_reason(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Refused')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Refused', fn (TestAgent $refused) => $refused->openRuntime('Mac', base_path()));
        $refused = $this->journal->openedRuntimeOf('Refused');
        $this->journal->withAgent('Refused', fn (TestAgent $agent) => $agent
            ->nameProcess('refused-probe', HostProcessPurpose::BuildProbe));
        [$open] = $this->journal->hostInstructionsOf('refused-probe');
        $this->journal->hostInstruction($open, fn (TestHostInstruction $instruction) => $instruction->refuse(HostRefusal::Unsafe));

        $this->journal->asSystem(new CheckDriverBuildCommand($this->probeOf($refused->sessionId), ''));

        $start = $this->journal->startOfSession($refused->sessionId);
        $this->journal->assertResult(
            [SessionProcessStatus::Stopped, true, false],
            [
                $start->status,
                str_contains((string) $start->refusal, 'build probe did not answer: it was lost'),
                str_contains((string) $start->refusal, 'is not the proven build'),
            ],
        );
    }

    /**
     * The agent's build probe ran and exited well, as a host that printed its build reports it.
     */
    private function probeExited(string $agent, string $probe): TestJournal
    {
        $this->journal->withAgent($agent, fn (TestAgent $named) => $named->nameProcess($probe, HostProcessPurpose::BuildProbe));

        return $this->journal->hostProcess($probe, fn (TestHostProcess $process) => $process
            ->report(HostProcessReportType::Running)
            ->report(HostProcessReportType::Exited, 0));
    }

    private function probeOf(string $sessionId): string
    {
        $start = $this->journal->startOfSession($sessionId);

        return HostProcess::query()->where('session_process_id', $start->id)->sole()->id;
    }

    private function recordedVersion(): string
    {
        $recordings = $this->journal->service(Recordings::class);

        return RecordedProgram::versionOf($recordings, DefaultDrivers::CLAUDE_CODE, 'claude');
    }
}
