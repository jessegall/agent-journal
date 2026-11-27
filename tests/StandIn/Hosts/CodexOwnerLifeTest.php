<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostProcess;
use App\Sessions\OpenedRuntime;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A Codex account's owner on the real host runs the turns of every runtime on that account, against the Codex
 * stand-in's app-server: a host restart ends it and fails the running turn, and the next message opens a new owner
 * that resumes the runtime's thread.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the real host, its Codex stand-in and a served journal.')]
final class CodexOwnerLifeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
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

    public function test_one_owner_serves_two_runtimes_ends_with_its_host_and_a_new_one_resumes_the_thread(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Coder')
            ->idleAgent('Tester')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
            ->chooseActiveAccountsOnTestHost()
            ->holdStandInTurns();
        $coder = $this->openProven('Coder', 'Run: ls.', 'owner');
        $tester = $this->openProven('Tester', 'Run: pwd.', 'owner');
        $work = $this->journal->driveHostProcess('owner', fn () => $this->isApplying($coder) && $this->isApplying($tester));
        $owners = HostProcess::query()->ofPurposes([HostProcessPurpose::AccountOwner])->count();

        // The owner reads its input from the host, so it ends with the host and exits.
        $this->journal->restartTestHost()->waitForHostProcess('owner', HostProcessStatus::Exited);
        // The owner's worker sees its process end and fails the turn it was running.
        $isFailed = fn () => $this->progressOf($coder->firstRequestId) === RequestProgress::Failed;
        $this->journal->driveHostProcess('owner', $isFailed, $work);
        $thread = AgentRuntime::query()->whereKey($coder->runtimeId)->sole()->conversation_id;
        $this->journal->releaseStandInTurns()->asOwner(DeliverAgentCommand::text(
            $this->journal->agentCalled('Coder')->id,
            $coder->sessionId,
            'again',
            'Run: ls again.',
        ));
        $this->journal->callAccountOwner('again', $coder->runtimeId)
            ->driveHostProcess('again', fn () => $this->resumedThread() !== null);

        $this->journal->assertResult(
            [1, $thread],
            [$owners, $this->resumedThread()],
        );
    }

    /**
     * Opens the agent's Codex runtime with its first message and proves its start; its turns run on the account's
     * owner, named as given.
     */
    private function openProven(string $agent, string $message, string $owner): OpenedRuntime
    {
        $opened = $this->journal->openCodexRuntimeOn($agent, 'Mac', base_path(), $message);
        $this->journal->proveStartOnTestHost($opened->runtimeId, HostProcessPurpose::AccountOwner, $owner);

        return $opened;
    }

    private function isApplying(OpenedRuntime $opened): bool
    {
        return $this->progressOf($opened->firstRequestId) === RequestProgress::Applying;
    }

    private function progressOf(string $requestId): RequestProgress
    {
        return DriverRequest::query()->whereKey($requestId)->sole()->progress;
    }

    /**
     * The thread an owner was asked to resume, from the thread/resume Codex heard; none before it.
     */
    private function resumedThread(): string|null
    {
        $resumes = array_filter(
            $this->journal->testHost()->heardByCodex(),
            fn (array $message) => ($message['method'] ?? null) === 'thread/resume',
        );

        return $resumes === [] ? null : array_values($resumes)[0]['params']['threadId'];
    }
}
