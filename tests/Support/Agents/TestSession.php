<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Agents\Inputs\Values\CompactionDetails;
use App\Agents\Inputs\Values\SessionStartDetails;
use App\Contracts\Work\StackTransactionRunner;
use App\Events\Sessions\SessionOpened;
use App\Hooks\ContextCollection;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\FinishedToolCalls;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\AgentSession;
use App\Sessions\SessionTokens;
use App\Sessions\StartHeartbeats;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\ToolResult;
use App\Support\ServerClock;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent's session, acted on in its own scope: it beats, falls silent, exits, loses its credential, starts its
 * context again, finishes tool calls and is handed its skills, each in the agent's own request.
 */
final class TestSession
{
    /**
     * @var list<string> the reminders the last context start added
     */
    private array $reminders = [];

    public function __construct(private readonly TestJournal $journal, private readonly AgentSession $session) {}

    /**
     * The session's agent sends a heartbeat, as a running agent does.
     */
    public function beat(): self
    {
        $this->journal->actAsAgentIds($this->session->agent_id, $this->session->id);

        try {
            $this->journal->run(new RecordHeartbeatCommand($this->session->id));
        } finally {
            $this->journal->reselect();
        }

        return $this;
    }

    /**
     * The session started the seconds ago and the journal's sweep marks it silent, as it marks a start that sent no
     * beat in that time.
     */
    public function silentFor(int $seconds): self
    {
        $started = $this->journal->service(ServerClock::class)->now()->subSeconds($seconds);
        DB::table('agent_sessions')->where('id', $this->session->id)->update(['created_at' => $started]);
        $this->journal->service(StartHeartbeats::class)->markSilentStarts();

        return $this;
    }

    /**
     * The session's process exited for the reason given.
     */
    public function exited(string $reason): self
    {
        $this->journal->service(StartHeartbeats::class)->markExited($this->session, $reason);

        return $this;
    }

    /**
     * The session's credential is revoked.
     */
    public function revokeToken(): self
    {
        $this->journal->service(SessionTokens::class)->revoke($this->session);

        return $this;
    }

    /**
     * The session ends now, its credential left live.
     */
    public function end(): self
    {
        $this->session->endAt(CarbonImmutable::now());

        return $this;
    }

    /**
     * The session's context starts again in the agent's own hook request, as its driver's start, clear, resume or
     * compaction hook does; the reminders the listeners of that boundary added are kept.
     */
    public function startContext(ContextStartType $type): self
    {
        $this->journal->actAsAgentIds($this->session->agent_id, $this->session->id);
        $identity = new HookIdentity(
            $this->session->agent_id,
            $this->session->id,
            'hook-'.bin2hex(random_bytes(4)),
            hash('sha256', $type->value),
        );
        $input = $type === ContextStartType::Compact
            ? new ContextCompacted($identity, new CompactionDetails('compaction-'.bin2hex(random_bytes(4))))
            : new SessionStarted($identity, new SessionStartDetails('vendor-session', $type, null));
        $target = new StackTarget($this->session->agent_id, $this->session->id);
        $this->reminders = $this->journal->service(StackTransactionRunner::class)->run(
            fn (): array => $this->journal->service(ContextCollection::class)->collectReminders($target, $input),
        );

        return $this;
    }

    /**
     * The session's tool call finished with this outcome, announced as the hook route does after its replay check, so
     * every listener of a finished tool call receives it in the agent's own request.
     *
     * @param  array<string, mixed>  $arguments
     */
    public function finishToolCall(string $tool, array $arguments, ToolOutcome $outcome = ToolOutcome::Succeeded): self
    {
        $this->journal->actAsAgentIds($this->session->agent_id, $this->session->id);
        $input = new ToolFinished(
            new HookIdentity(
                $this->session->agent_id,
                $this->session->id,
                'hook-'.bin2hex(random_bytes(4)),
                hash('sha256', $tool),
            ),
            new ToolResult($tool, $outcome, new DriverToolInput($arguments)),
        );
        $this->journal->service(FinishedToolCalls::class)->announce(
            new StackTarget($this->session->agent_id, $this->session->id),
            $input,
        );

        return $this;
    }

    /**
     * The session is handed its skills as its start admits them.
     */
    public function handSkills(): self
    {
        $this->journal->service(AdmitStartSkills::class)->handle(
            new SessionOpened($this->session->agent_id, $this->session->id),
        );

        return $this;
    }

    /**
     * The reminders the last context start added, in order.
     *
     * @return list<string>
     */
    public function reminders(): array
    {
        return $this->reminders;
    }
}
