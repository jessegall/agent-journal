<?php

declare(strict_types=1);

namespace App\Models\Hosts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessInputGenerationRaised;
use App\Events\Connections\HostProcessInstructionNumbered;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessOpened;
use App\Events\Connections\HostProcessOpenInstructionHeld;
use App\Events\Connections\HostProcessOutputRecorded;
use App\Events\Connections\HostProcessRestarted;
use App\Events\Connections\HostProcessSeenInHeartbeat;
use App\Events\Connections\HostProcessStarted;
use App\Events\Connections\HostProcessWorkerClaimed;
use App\Events\Connections\HostProcessWorkerRenewed;
use App\Exceptions\HostProcessGone;
use App\Exceptions\WorkerFenced;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Values\ProcessExit;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Models\Support\SessionProcessScope;
use App\Records\Contracts\ReadableModel;
use App\Values\HostProcessPlan;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $host_id
 * @property string|null $agent_runtime_id
 * @property string|null $session_process_id
 * @property HostProcessPurpose $purpose
 * @property HostProcessType $type
 * @property int $generation
 * @property RestartPolicy $restart
 * @property HostProcessStatus $status
 * @property string|null $execution_identity
 * @property int $input_generation
 * @property int $output_offset
 * @property int $instruction_sequence
 * @property int|null $exit_code
 * @property string|null $exit_signal
 * @property string|null $exit_evidence
 * @property int $worker_generation
 * @property CarbonImmutable|null $worker_until
 * @property string|null $open_instruction_id
 * @property int $missed_heartbeats
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read string $container_name
 * @property-read string $end_evidence
 * @property-read Host $host
 * @property-read AgentRuntime|null $runtime
 * @property-read SessionProcess|null $sessionProcess
 *
 * @mixin \Eloquent
 */
final class HostProcess extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * The start of the name of every container the host opens a process in, followed by the process's id.
     */
    private const string CONTAINER_PREFIX = 'journal-process-';

    /**
     * How many heartbeats in a row may leave a process out before it is lost.
     */
    public const int HEARTBEATS_MISSED_LIMIT = 2;

    /**
     * How long a worker holds a process after its last renewal; it renews well inside it.
     */
    public const int WORKER_LEASE_SECONDS = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purpose' => HostProcessPurpose::class,
            'type' => HostProcessType::class,
            'restart' => RestartPolicy::class,
            'status' => HostProcessStatus::class,
            'generation' => 'integer',
            'input_generation' => 'integer',
            'output_offset' => 'integer',
            'instruction_sequence' => 'integer',
            'exit_code' => 'integer',
            'worker_generation' => 'integer',
            'worker_until' => 'immutable_datetime',
            'started_at' => 'immutable_datetime',
            'ended_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A process the journal instructs the host to open, for the runtime it runs and the start it runs for, when it has
     * them.
     */
    public static function create(
        Host $host,
        AgentRuntime|null $runtime,
        HostProcessPlan $plan,
        SessionProcess|null $start = null,
    ): self {
        $process = new self();
        $process->host_id = $host->id;
        $process->agent_runtime_id = $runtime?->id;
        $process->session_process_id = $start?->id;
        $process->purpose = $plan->purpose;
        $process->type = $plan->type;
        $process->restart = $plan->restart;
        $process->status = HostProcessStatus::Ordered;
        $process->saveAndAssert();
        $process->raise(new HostProcessOpened($process->id, $process->agent_runtime_id, $runtime?->agent_session_id));

        return $process;
    }

    // ----------[ Mutations ]----------

    /**
     * The host started the process under this identity and generation.
     */
    public function run(string $identity, int $generation, CarbonImmutable $at): void
    {
        $this->status = HostProcessStatus::Running;
        $this->execution_identity = $identity;
        $this->generation = $generation;
        $this->started_at ??= $at;
        $this->saveAndAssert();
        $this->raise(new HostProcessStarted($this->id, $this->agent_runtime_id, $generation, $identity));
    }

    /**
     * The host healed the crashed process and runs it again under a new identity.
     */
    public function restart(string $identity): void
    {
        $this->status = HostProcessStatus::Running;
        $this->execution_identity = $identity;
        $this->generation++;
        $this->saveAndAssert();
        $this->raise(new HostProcessRestarted($this->id, $this->agent_runtime_id, $this->generation, $identity));
    }

    /**
     * The process exited at the time given, with its exit code, signal and evidence.
     */
    public function exit(ProcessExit $exit, CarbonImmutable $at): void
    {
        $this->status = HostProcessStatus::Exited;
        $this->exit_code = $exit->exitCode;
        $this->exit_signal = $exit->signal;
        $this->exit_evidence = $exit->evidence;
        $this->ended_at = $at;
        $this->saveAndAssert();

        $this->raise(new HostProcessExited(
            $this->id,
            $this->agent_runtime_id,
            $this->sessionId(),
            $exit->exitCode,
            $exit->signal,
            $exit->evidence,
        ));
    }

    /**
     * The host lost the process at the time given, with the evidence of how.
     */
    public function lose(string $evidence, CarbonImmutable $at): void
    {
        $this->status = HostProcessStatus::Lost;
        $this->exit_evidence = $evidence;
        $this->ended_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostProcessLost($this->id, $this->agent_runtime_id, $this->sessionId(), $evidence));
    }

    /**
     * The host sent the pipe process's standard output through the offset given; a later post that sent less moves
     * nothing. The row is locked by its caller, so two posts never move it backwards.
     */
    public function recordOutputThrough(int $offset): void
    {
        if ($offset <= $this->output_offset) {
            return;
        }

        $this->output_offset = $offset;
        $this->saveAndAssert();
        $this->raise(new HostProcessOutputRecorded($this->id, $offset));
    }

    /**
     * Whether the host holds less of the pipe process's standard output than it already sent, as when its spool was
     * lost in a restart, so what the process prints next cannot be read in order.
     */
    public function hasLostOutputOf(int $spoolOffset): bool
    {
        return $this->type === HostProcessType::Pipe && $spoolOffset < $this->output_offset;
    }

    /**
     * A heartbeat named the process: it runs as far as the host knows.
     */
    public function seeInHeartbeat(): void
    {
        if ($this->missed_heartbeats === 0) {
            return;
        }

        $this->missed_heartbeats = 0;
        $this->saveAndAssert();
        $this->raise(new HostProcessSeenInHeartbeat($this->id));
    }

    /**
     * A heartbeat built after its open instruction was answered left the process out; the second in a row loses it.
     */
    public function missInHeartbeat(CarbonImmutable $at): void
    {
        $this->missed_heartbeats++;
        $this->saveAndAssert();

        if ($this->missed_heartbeats >= self::HEARTBEATS_MISSED_LIMIT) {
            $this->lose('two heartbeats of its host in a row left it out', $at);
        }
    }

    /**
     * A new worker takes the process over: its number is raised, so the worker before it is refused from now on.
     */
    public function claimWorker(CarbonImmutable $now): int
    {
        $this->worker_generation++;
        $this->worker_until = $now->addSeconds(self::WORKER_LEASE_SECONDS);
        $this->saveAndAssert();
        $this->raise(new HostProcessWorkerClaimed($this->id, $this->worker_generation));

        return $this->worker_generation;
    }

    /**
     * The journal worker that drives the process renews its hold on it; a fenced worker is refused.
     *
     * @throws WorkerFenced
     */
    public function renewWorker(int $generation, CarbonImmutable $now): void
    {
        $this->assertWorker($generation);
        $this->worker_until = $now->addSeconds(self::WORKER_LEASE_SECONDS);
        $this->saveAndAssert();
        $this->raise(new HostProcessWorkerRenewed($this->id, $generation));
    }

    /**
     * The next number of the process's instructions; the caller holds the row's lock.
     */
    public function takeInstructionNumber(): int
    {
        $this->instruction_sequence++;
        $this->saveAndAssert();
        $this->raise(new HostProcessInstructionNumbered($this->id, $this->instruction_sequence));

        return $this->instruction_sequence;
    }

    /**
     * The process keeps the order that opens it.
     */
    public function holdOpenInstruction(string $instructionId): void
    {
        $this->open_instruction_id = $instructionId;
        $this->saveAndAssert();
        $this->raise(new HostProcessOpenInstructionHeld($this->id, $instructionId));
    }

    /**
     * The user typed into the process: a guarded write made before this is refused by the host.
     */
    public function raiseInputGeneration(): int
    {
        $this->input_generation++;
        $this->saveAndAssert();
        $this->raise(new HostProcessInputGenerationRaised($this->id, $this->input_generation));

        return $this->input_generation;
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the host had answered the order that opened the process when it built a report through that instruction:
     * a process opened after it is not missing from the report, only newer than it.
     */
    public function isOpenedBy(string|null $answeredThrough): bool
    {
        return $this->open_instruction_id !== null
            && $answeredThrough !== null
            && $this->open_instruction_id <= $answeredThrough;
    }

    public function isLive(): bool
    {
        return $this->status->isLive();
    }

    /**
     * Whether the process ran to its end and exited with 0, as a probe that answered does.
     */
    public function hasExitedWell(): bool
    {
        return $this->status === HostProcessStatus::Exited && $this->exit_code === 0;
    }

    /**
     * Whether the process never ran to an end of its own: the host refused to open it or lost it.
     */
    public function isLost(): bool
    {
        return $this->status === HostProcessStatus::Lost;
    }

    /**
     * Whether the host was asked to open the process and has not reported it running yet.
     */
    public function isOrdered(): bool
    {
        return $this->status === HostProcessStatus::Ordered;
    }

    // ----------[ Accessors ]----------

    /**
     * The name the host gives the container a contained process runs in.
     *
     * @return Attribute<non-falsy-string, never>     */
    protected function containerName(): Attribute
    {
        return Accessor::get(fn () => self::CONTAINER_PREFIX.$this->id);
    }

    /**
     * How the host reported the process ended: its exit code, or its loss with the host's reason.
     *
     * @return Attribute<non-falsy-string, never>     */
    protected function endEvidence(): Attribute
    {
        return Accessor::get(function () {
            $ended = $this->status === HostProcessStatus::Lost ? 'was lost' : "exited with {$this->exit_code}";

            if ($this->exit_evidence === null) {
                return $ended;
            }

            return "{$ended}: {$this->exit_evidence}";
        });
    }

    // ----------[ Relations ]----------

    /**
     * The start the process runs for, whoever's agent it belongs to.
     *
     * @return BelongsTo<SessionProcess, $this>
     */
    public function sessionProcess(): BelongsTo
    {
        return $this->belongsTo(SessionProcess::class)->withoutGlobalScope(SessionProcessScope::class);
    }

    /**
     * @return BelongsTo<Host, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(Host::class);
    }

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    // ----------[ Asserts ]----------

    /**
     * @throws WorkerFenced
     */
    public function assertWorker(int $generation): void
    {
        if ($this->worker_generation !== $generation) {
            throw WorkerFenced::forProcess($this->id, $generation, $this->worker_generation);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The session the process runs for: its runtime's, or for an account's owner, which serves no one runtime, that of
     * the start it was opened for; none for a process of neither, such as a probe the host itself runs.
     */
    public function sessionId(): string|null
    {
        if ($this->agent_runtime_id !== null) {
            return AgentRuntime::query()->whereKey($this->agent_runtime_id)->value('agent_session_id');
        }

        if ($this->session_process_id === null) {
            return null;
        }

        return SessionProcess::query()->supervised()->whereKey($this->session_process_id)->value('session_id');
    }

    /**
     * The host's live processes, locked, as a report of the host's walks them.
     *
     * @return list<self>
     */
    public static function findLiveOn(Host $host): array
    {
        return array_values(self::query()->with('runtime')->onHost($host)->live()->lockForUpdate()->get()->all());
    }

    /**
     * When the first lease of a driven process ends, so the supervisor looks again then and not before.
     *
     * @param  list<HostProcessPurpose>  $purposes
     */
    public static function resolveNextLeaseEnd(array $purposes, CarbonImmutable $now): CarbonImmutable|null
    {
        $until = self::query()->drivenAt($now)->ofPurposes($purposes)->min('worker_until');

        if ($until === null) {
            return null;
        }

        return CarbonImmutable::parse($until);
    }

    /**
     * When a process working for the session last moved, its output or its state: one of its runtime, or an account's
     * owner opened for one of its starts, which serves the session without being its runtime's.
     */
    public static function resolveLastMovedAtOfSession(string $sessionId): CarbonImmutable|null
    {
        $moved = self::query()->withoutGlobalScopes()->workingForSession($sessionId)->max('updated_at');

        if ($moved === null) {
            return null;
        }

        return CarbonImmutable::parse((string) $moved);
    }

    /**
     * The newest process opened for the session's runtime; none before one opened.
     */
    public static function findNewestOfSession(string $sessionId): self|null
    {
        return self::query()->withoutGlobalScopes()->ofSession($sessionId)->latest('created_at')->first();
    }

    /**
     * The process with its host, locked until the transaction ends, so its instructions are numbered and its worker
     * checked one at a time.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->with('host')->whereKey($id)->lockForUpdate()
            ->firstOr(HostProcessGone::throwing()->forProcess($id));
    }

    /**
     * Whether a live process of one of the purposes runs on the host.
     *
     * @param  list<HostProcessPurpose>  $purposes
     */
    public static function hasLiveOfPurposesOn(string $hostId, array $purposes): bool
    {
        return self::query()->onHostWithId($hostId)->ofPurposes($purposes)->live()->exists();
    }

    /**
     * Whether a process of the session's runtime still runs or waits to start, so a stop has something to reach.
     */
    public static function hasLiveOfSession(string $sessionId): bool
    {
        return self::query()->live()->ofSession($sessionId)->exists();
    }

    /**
     * Whether the start was given its build probe, so it is not probed twice.
     */
    public static function hasBuildProbeOf(string $startId): bool
    {
        return self::query()->ofStarts([$startId])->ofPurposes([HostProcessPurpose::BuildProbe])->exists();
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onHost(Builder $query, Host $host): void
    {
        $query->where('host_id', $host->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onHostWithId(Builder $query, string $hostId): void
    {
        $query->where('host_id', $hostId);
    }

    /**
     * The processes of the session's runtimes.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->whereHas('runtime', fn (Builder $runtime) => $runtime->ofSessions([$sessionId]));
    }

    /**
     * The processes of the session's runtime and those opened for one of its starts, such as an account's owner.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function workingForSession(Builder $query, string $sessionId): void
    {
        $query->where(fn (Builder $working) => $working
            ->whereHas('runtime', fn (Builder $runtime) => $runtime->ofSessions([$sessionId]))
            ->orWhereHas('sessionProcess', fn (Builder $start) => $start->ofSessions([$sessionId])));
    }

    /**
     * The live processes no worker holds now: none ever did, or its lease ended.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function needingWorker(Builder $query, CarbonImmutable $now): void
    {
        $query->live()->where(
            fn (Builder $free) => $free->whereNull('worker_until')->orWhere('worker_until', '<', $now),
        );
    }

    /**
     * @param  Builder<self>  $query
     * @param  list<HostProcessPurpose>  $purposes
     */
    #[Scope]
    protected function ofPurposes(Builder $query, array $purposes): void
    {
        $query->whereIn('purpose', $purposes);
    }

    /**
     * The live processes a worker holds the lease of now.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function drivenAt(Builder $query, CarbonImmutable $now): void
    {
        $query->live()->where('worker_until', '>=', $now);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function live(Builder $query): void
    {
        $query->whereIn('status', [HostProcessStatus::Ordered, HostProcessStatus::Running]);
    }

    /**
     * The processes their host took up: it reported them running or ended, rather than leaving them only ordered.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function takenUp(Builder $query): void
    {
        $query->where('status', '!=', HostProcessStatus::Ordered);
    }

    /**
     * The starts the processes were opened for, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function startIds(Builder $query): void
    {
        $query->whereNotNull('session_process_id')->select('session_process_id');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRuntime(Builder $query): void
    {
        $query->with('runtime');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withHost(Builder $query): void
    {
        $query->with('host');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSessionProcess(Builder $query): void
    {
        $query->with('sessionProcess');
    }

    /**
     * The processes opened for these starts.
     *
     * @param  Builder<self>  $query
     * @param  list<string>|Builder<SessionProcess>  $ids
     */
    #[Scope]
    protected function ofStarts(Builder $query, array|Builder $ids): void
    {
        $query->whereIn('session_process_id', $ids);
    }
}
