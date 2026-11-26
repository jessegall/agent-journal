<?php

declare(strict_types=1);

namespace App\Models\Hosts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessRestarted;
use App\Events\Connections\HostProcessStarted;
use App\Exceptions\WorkerFenced;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Models\Support\JournalModel;
use App\Values\HostProcessPlan;
use App\Values\ProcessExit;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $host_id
 * @property string|null $agent_runtime_id
 * @property HostProcessPurpose $purpose
 * @property HostProcessType $type
 * @property int $generation
 * @property string|null $container_name
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
 *
 * @mixin \Eloquent
 */
final class HostProcess extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * How long a worker holds a process after its last renewal; it renews well inside it.
     */
    /**
     * How many heartbeats in a row may leave a process out before it is lost.
     */
    public const int HEARTBEATS_MISSED_LIMIT = 2;

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
     * A process the journal orders the host to open, for the runtime it runs when it runs one.
     */
    public static function create(Host $host, AgentRuntime|null $runtime, HostProcessPlan $plan): self
    {
        $process = new self();
        $process->host_id = $host->id;
        $process->agent_runtime_id = $runtime?->id;
        $process->purpose = $plan->purpose;
        $process->type = $plan->type;
        $process->restart = $plan->restart;
        $process->status = HostProcessStatus::Ordered;
        $process->assertSaved($process->save());

        return $process;
    }

    // ----------[ Relations ]----------

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
        $this->assertSaved($this->save());
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
        $this->assertSaved($this->save());
        $this->raise(new HostProcessRestarted($this->id, $this->agent_runtime_id, $this->generation, $identity));
    }

    public function exit(ProcessExit $exit, CarbonImmutable $at): void
    {
        $this->status = HostProcessStatus::Exited;
        $this->exit_code = $exit->exitCode;
        $this->exit_signal = $exit->signal;
        $this->exit_evidence = $exit->evidence;
        $this->ended_at = $at;
        $this->assertSaved($this->save());

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
        $this->assertSaved($this->save());
        $this->raise(new HostProcessLost($this->id, $this->agent_runtime_id, $evidence));
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
        $this->assertSaved($this->save());
    }

    /**
     * A heartbeat built after its open order was answered left the process out; the second in a row loses it.
     */
    public function missInHeartbeat(CarbonImmutable $at): void
    {
        $this->missed_heartbeats++;
        $this->assertSaved($this->save());

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
        $this->assertSaved($this->save());

        return $this->worker_generation;
    }

    /**
     * @throws WorkerFenced
     */
    public function renewWorker(int $generation, CarbonImmutable $now): void
    {
        $this->assertWorker($generation);
        $this->worker_until = $now->addSeconds(self::WORKER_LEASE_SECONDS);
        $this->assertSaved($this->save());
    }

    /**
     * The next number of the process's orders; the caller holds the row's lock.
     */
    public function takeOrderNumber(): int
    {
        $this->order_sequence++;
        $this->assertSaved($this->save());

        return $this->order_sequence;
    }

    public function holdOpenOrder(string $orderId): void
    {
        $this->open_order_id = $orderId;
        $this->assertSaved($this->save());
    }

    /**
     * The user typed into the process: a guarded write made before this is refused by the host.
     */
    public function raiseInputGeneration(): int
    {
        $this->input_generation++;
        $this->assertSaved($this->save());

        return $this->input_generation;
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
     * The process, locked until the transaction ends, so its orders are numbered and its worker checked one at a time.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
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
}
