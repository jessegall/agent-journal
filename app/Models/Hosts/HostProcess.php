<?php

declare(strict_types=1);

namespace App\Models\Hosts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessInputGenerationRaised;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessOpened;
use App\Events\Connections\HostProcessOpenOrderHeld;
use App\Events\Connections\HostProcessOrderNumbered;
use App\Events\Connections\HostProcessOutputRecorded;
use App\Events\Connections\HostProcessRestarted;
use App\Events\Connections\HostProcessSeenInHeartbeat;
use App\Events\Connections\HostProcessStarted;
use App\Events\Connections\HostProcessWorkerClaimed;
use App\Events\Connections\HostProcessWorkerRenewed;
use App\Exceptions\WorkerFenced;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Values\ProcessExit;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Models\Support\JournalModel;
use App\Models\Support\SessionProcessScope;
use App\Records\Contracts\ReadableModel;
use App\Values\HostProcessPlan;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
 * @property int $order_sequence
 * @property int|null $exit_code
 * @property string|null $exit_signal
 * @property string|null $exit_evidence
 * @property int $worker_generation
 * @property CarbonImmutable|null $worker_until
 * @property string|null $open_order_id
 * @property int $missed_heartbeats
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
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
            'order_sequence' => 'integer',
            'exit_code' => 'integer',
            'worker_generation' => 'integer',
            'worker_until' => 'immutable_datetime',
            'started_at' => 'immutable_datetime',
            'ended_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A process the journal orders the host to open, for the runtime it runs and the start it runs for, when it has
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
        $process->raise(new HostProcessOpened($process->id, $process->agent_runtime_id));

        return $process;
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
            $exit->exitCode,
            $exit->signal,
            $exit->evidence,
        ));
    }

    public function lose(string $evidence, CarbonImmutable $at): void
    {
        $this->status = HostProcessStatus::Lost;
        $this->exit_evidence = $evidence;
        $this->ended_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostProcessLost($this->id, $this->agent_runtime_id, $evidence));
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
     * A heartbeat built after its open order was answered left the process out; the second in a row loses it.
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
     * The next number of the process's orders; the caller holds the row's lock.
     */
    public function takeOrderNumber(): int
    {
        $this->order_sequence++;
        $this->saveAndAssert();
        $this->raise(new HostProcessOrderNumbered($this->id, $this->order_sequence));

        return $this->order_sequence;
    }

    public function holdOpenOrder(string $orderId): void
    {
        $this->open_order_id = $orderId;
        $this->saveAndAssert();
        $this->raise(new HostProcessOpenOrderHeld($this->id, $orderId));
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

    /**
     * The name the host gives the container a contained process runs in.
     */
    public function containerName(): string
    {
        return self::CONTAINER_PREFIX.$this->id;
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the host had answered the order that opened the process when it built a report through that order: a
     * process opened after it is not missing from the report, only newer than it.
     */
    public function isOpenedBy(string|null $answeredThrough): bool
    {
        return $this->open_order_id !== null && $answeredThrough !== null && $this->open_order_id <= $answeredThrough;
    }

    public function isLive(): bool
    {
        return $this->status->isLive();
    }

    /**
     * Whether the host was asked to open the process and has not reported it running yet.
     */
    public function isOrdered(): bool
    {
        return $this->status === HostProcessStatus::Ordered;
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
     * The host's live processes, locked, as a report of the host's walks them.
     *
     * @return list<self>
     */
    public static function findLiveOn(Host $host): array
    {
        return array_values(self::query()->onHost($host)->live()->lockForUpdate()->get()->all());
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
     * The process with its host, locked until the transaction ends, so its orders are numbered and its worker checked
     * one at a time.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->with('host')->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * Whether a live process of one of the purposes runs on the host.
     *
     * @param  list<HostProcessPurpose>  $purposes
     */
    public static function hasLiveOfPurposesOn(string $hostId, array $purposes): bool
    {
        return self::query()->where('host_id', $hostId)->ofPurposes($purposes)->live()->exists();
    }

    /**
     * Whether a live owner on the host runs the headless turns of the start's account and sign-in generation.
     */
    public static function hasLiveOwnerOf(string $hostId, SessionProcess $start): bool
    {
        return self::query()
            ->where('host_id', $hostId)
            ->ofPurposes([HostProcessPurpose::AccountOwner])
            ->live()
            ->whereHas('sessionProcess', fn (Builder $owned) => $owned->onAccountGenerationOf($start))
            ->exists();
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
}
