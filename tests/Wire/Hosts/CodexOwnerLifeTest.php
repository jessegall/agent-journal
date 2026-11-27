<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Assertions\Assert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Hosts\Steps\ReleasesTurns;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Mocks\Answer;
use Tests\Support\Mocks\CodexMock;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A Codex account's owner on the real host runs the turns of every runtime on that account, against the Codex
 * mock's app-server: a host restart ends it and fails the running turn, and the next message opens a new owner
 * that resumes the runtime's thread.
 */
#[OverTheWire]
#[TimeLimit(seconds: 60, reason: 'It runs the real host, its Codex mock and a served journal.')]
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
        $applying = fn (string $agent) => fn (Assert $journal) => $journal
            ->where("agents.{$agent}.runtime.firstRequest.progress", RequestProgress::Applying);

        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Coder')
            ->idleAgent('Tester')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->mocks($this->twoOwners())->chooseActiveAccounts()->holdTurns())
            ->withAgent('Coder', fn (TestAgent $coder) => $coder
                ->openCodexRuntime('Mac', base_path(), 'Run: ls.')
                ->proveStart(HostProcessPurpose::AccountOwner, 'owner'))
            ->withAgent('Tester', fn (TestAgent $tester) => $tester
                ->openCodexRuntime('Mac', base_path(), 'Run: pwd.')
                ->proveStart(HostProcessPurpose::AccountOwner, 'tester owner'))
            ->hostProcess('owner', fn (TestHostProcess $owner) => $owner
                ->driveUntil($applying('Coder'))
                ->driveUntil($applying('Tester')))
            ->assertJournal(fn (Assert $journal) => $journal
                ->count('purposes.'.HostProcessPurpose::AccountOwner->value, 1))
            ->testHost(fn (TestHost $mac) => $mac->restartHost())
            // The owner reads its input from the host, so it ends with the host, and its worker fails the running turn.
            ->hostProcess('owner', fn (TestHostProcess $owner) => $owner
                ->waitFor(HostProcessStatus::Exited)
                ->driveUntil(fn (Assert $journal) => $journal
                    ->where('agents.Coder.runtime.firstRequest.progress', RequestProgress::Failed)))
            ->testHost(fn (TestHost $mac) => $mac->releaseTurns())
            ->withAgent('Coder', fn (TestAgent $coder) => $coder
                ->deliver('again', 'Run: ls again.')->callAccountOwner('again'))
            ->hostProcess('again', fn (TestHostProcess $again) => $again
                ->driveUntil(fn (Assert $journal) => $journal->count('testHost.heardByCodex.turn/start', 3)))
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('agents.Coder.runtime', fn (Assert $runtime) => $runtime
                    ->where('conversation', fn (string $thread) => $thread === $journal->value(
                        'testHost.heardByCodex.thread/resume.0.params.threadId',
                    ))
                    ->etc()));
    }

    /**
     * What the account's first owner hears from both runtimes, its turns held until released, and what the owner
     * opened after the host restarted hears when it resumes the first runtime's thread.
     */
    private function twoOwners(): CodexMock
    {
        $opened = fn (CodexMock $mock) => $mock
            ->expects('initialize', fn (Answer $answer) => $answer->replies('app-server'))
            ->expects('initialized', fn (Answer $answer) => $answer)
            ->expects('account/read', fn (Answer $answer) => $answer->replies('app-server'));
        $turn = fn (Answer $answer) => $answer
            ->replies('app-server')
            ->notifies('app-server', 'turn/started')
            ->waitsFor(ReleasesTurns::class)
            ->notifies('app-server', 'turn/completed');

        return $opened($opened(CodexMock::from('codex/0.165.0'))
            ->expects('thread/start', fn (Answer $answer) => $answer->replies('app-server'))
            ->expects('turn/start', $turn)
            ->expects('thread/start', fn (Answer $answer) => $answer->replies('app-server'))
            ->expects('turn/start', $turn))
            ->expects('thread/resume', fn (Answer $answer) => $answer->replies('resume-and-interrupt'))
            ->expects('turn/start', fn (Answer $answer) => $answer->replies('resume-and-interrupt'));
    }
}
