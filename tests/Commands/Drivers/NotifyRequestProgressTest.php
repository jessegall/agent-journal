<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Commands\Agents\RepairDriverSettings\RepairDriverSettingsCommand;
use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Terminals\CancelKeyScript\CancelKeyScriptCommand;
use App\Commands\Terminals\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Sessions\SessionStatus;
use App\Exceptions\HostReportRefused;
use App\Models\Accounts\Account;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\ActorContext;
use App\Support\AgentStatus;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\OwnerAuthority;
use App\Values\ScriptProgress;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A host reports how far a request got: a staged report gives the request back after a wait, the host's facts hold a
 * runtime for attention, an applied stop keeps stopping until its exit is proved, a failed effort change is repaired
 * in its own place in the queue, and a stopped key script resumes from its step or is cancelled.
 */
final class NotifyRequestProgressTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    public function test_a_staged_report_gives_the_request_back_to_be_offered_again_after_a_wait(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Behind a menu');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->notifyProgress($host->hostId, $opened->firstRequestId, RequestProgress::Staged);

        $this->assertSame(RequestProgress::Accepted, DriverRequest::query()->findOrFail($opened->firstRequestId)->progress);
        $tooSoon = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->assertSame([], $tooSoon->requests);

        $this->travel(3)->seconds();
        $again = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->assertSame(
            [$opened->firstRequestId],
            array_map(fn ($request): string => $request->requestId, $again->requests),
        );
    }

    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    public function test_the_journal_holds_a_runtime_for_attention_from_the_hosts_facts(): void
    {
        [$host, $signedOut] = $this->openRuntime(firstMessage: 'Signed out');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $wake = DriverRequest::query()->findOrFail($signedOut->firstRequestId);
        $this->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
            refusal: HostWakeRefusal::NotSignedIn,
            hasCreatedNoProcess: true,
        ));

        [$stopHost, $stopped] = $this->openRuntime();
        $stop = $this->asOwner(new StopAgentCommand($this->agentIdOf($stopped), $stopped->sessionId, 'stop-1'));
        $this->asSystem(new ClaimDriverRequestsCommand($stopHost->hostId, 10, BrowserInputCapabilities::none()));
        $this->asSystem(new NotifyRequestProgressCommand(
            $stopHost->hostId,
            $stop->requestId,
            DriverRequest::query()->findOrFail($stop->requestId)->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::StopUnconfirmed,
        ));

        $this->assertSame(
            [HoldReason::NeedsAttention, HoldReason::NeedsAttention],
            [
                AgentRuntime::query()->findOrFail($signedOut->runtimeId)->hold_reason,
                AgentRuntime::query()->findOrFail($stopped->runtimeId)->hold_reason,
            ],
        );
    }

    /**
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
    public function test_an_applied_stop_keeps_stopping_until_the_exit_of_its_generation_is_proved(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $stop = $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-1', $runtime->process_generation));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->notifyProgress($host->hostId, $stop->requestId, RequestProgress::Applied);

        $this->assertSame('Stopping', $this->statusOf($agentId)->label);

        $this->assertThrows(
            fn () => $this->asSystem(
                new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $runtime->process_generation - 1, 'old exit'),
            ),
            HostReportRefused::class,
        );
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);

        $this->notifyExit($host, $opened);

        $this->assertSame('Stopped', $this->statusOf($agentId)->label);
    }

    public function test_a_failed_effort_change_is_repaired_in_its_own_place_in_the_queue(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($effort->requestId);
        $attempt = $request->attempt_version;
        $this->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $attempt,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
        ));
        $request->refresh();
        $sequence = $request->sequence;

        $this->asOwner(new RepairDriverSettingsCommand($request->id, $request->row_version, 'low', 'high is not offered'));

        $request->refresh();
        $this->assertSame([RequestProgress::Accepted, 'low'], [$request->progress, $request->effort]);
        $this->assertSame([$sequence, $attempt + 1], [$request->sequence, $request->attempt_version]);
        $this->assertSame('low', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
    }

    public function test_a_stopped_key_script_resumes_from_its_step_or_is_cancelled(): void
    {
        [$host, $opened] = $this->openRuntime();
        $resumed = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']))->requestId,
        );
        $cancelled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'opus']))->requestId,
        );

        foreach ([$resumed, $cancelled] as $request) {
            $this->asSystem(new NotifyRequestProgressCommand(
                $host->hostId,
                $request->id,
                $request->attempt_version,
                RequestProgress::Applying,
                null,
                null,
                new ScriptProgress(2, 7, 'paused: a user typed'),
            ));
            $request->refresh();
        }

        $attempt = $resumed->attempt_version;

        $this->asOwner(new ResumeKeyScriptCommand($resumed->id, $resumed->row_version, 'done typing'));
        $this->asOwner(new CancelKeyScriptCommand($cancelled->id, $cancelled->row_version, 'not needed'));

        $resumed->refresh();
        $this->assertSame(RequestProgress::Accepted, $resumed->progress);
        $this->assertSame([$attempt + 1, 2], [$resumed->attempt_version, $resumed->script_step]);
        $this->assertSame(RequestProgress::Cancelled, $cancelled->fresh()?->progress);
    }

    private function statusOf(string $agentId): AgentStatus
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(AgentDirectory::class)->visibleAgent($agentId)->status;
    }

    private function notifyExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));
    }

    private function notifyProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->asSystem(new NotifyRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            hasCreatedNoProcess: true,
        ));
    }
}
