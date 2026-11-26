<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\CheckDriverBuild\CheckDriverBuildCommand;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use App\Support\Drivers\Profiles\ClaudeCodeProfile;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
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
        'hosts', 'host_processes', 'host_orders', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'agent_runtimes', 'driver_requests', 'driver_turns', 'accounts', 'active_accounts',
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users',
    ];

    public function test_only_the_pinned_build_lets_the_start_go_on(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Pinned')
            ->idleAgent('Other')
            ->enrollHost('Mac', [base_path()]);
        $pinned = $this->journal->openRuntimeOn('Pinned', 'Mac', base_path());
        $other = $this->journal->openRuntimeOn('Other', 'Mac', base_path());
        $build = $this->journal->service(ClaudeCodeProfile::class)->build();

        $this->journal
            ->asSystem(new CheckDriverBuildCommand($this->probeOf($pinned->sessionId), "{$build} (Claude Code)\n"));
        $this->journal
            ->asSystem(new CheckDriverBuildCommand($this->probeOf($other->sessionId), "9.9.9 (Claude Code)\n"));

        $refused = $this->journal->startOfSession($other->sessionId);
        $this->journal->callJournalProcess('sign-in', $pinned->runtimeId, HostProcessPurpose::SignInProbe);
        $this->journal->assertResult(
            [
                SessionProcessStatus::Starting,
                ['{host:INSTALLATION}/bin/claude', 'auth', 'status', '--json'],
                SessionProcessStatus::Stopped,
                true,
            ],
            [
                $this->journal->startOfSession($pinned->sessionId)->status,
                $this->journal->payloadOf($this->journal->hostOrdersOf('sign-in')[0])['argv'],
                $refused->status,
                str_contains((string) $refused->refusal, 'is not the proven build'),
            ],
        );
    }

    private function probeOf(string $sessionId): string
    {
        $start = $this->journal->startOfSession($sessionId);

        return HostProcess::query()->where('session_process_id', $start->id)->sole()->id;
    }
}
