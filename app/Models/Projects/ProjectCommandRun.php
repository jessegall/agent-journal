<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Connections\Api\ProjectCommandFrame;
use App\Connections\Enums\CommandRunStatus;
use App\Contracts\Events\EventSource;
use App\Events\Connections\ProjectCommandCancellationRequested;
use App\Events\Connections\ProjectCommandCancelled;
use App\Events\Connections\ProjectCommandFinished;
use App\Events\Connections\ProjectCommandProcessRecorded;
use App\Events\Connections\ProjectCommandReconciled;
use App\Models\Support\JournalModel;
use App\Projects\CommandRunEvidence;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $request_key
 * @property string $agent_id
 * @property string $binding_id
 * @property list<string> $argv
 * @property CommandRunStatus $status
 * @property int|null $pid
 * @property int|null $exit_code
 * @property DataCollection<int, ProjectCommandFrame> $frames
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string $fingerprint
 * @property string $worker
 *
 * @mixin \Eloquent
 */
final class ProjectCommandRun extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column argv list<string>
     */
    protected function casts(): array
    {
        return [
            'argv' => 'array',
            'status' => CommandRunStatus::class,
            'frames' => DataCollection::class.':'.ProjectCommandFrame::class,
            'pid' => 'integer',
            'exit_code' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps the run's intent before its process starts: the request id, the operation's fingerprint and its worker.
     *
     * @param  list<string>  $argv
     */
    public static function create(
        string $requestKey,
        string $agentId,
        ProjectBinding $binding,
        array $argv,
        string $fingerprint,
        string $worker,
    ): self {
        $run = new self();
        $run->request_key = $requestKey;
        $run->agent_id = $agentId;
        $run->binding_id = $binding->id;
        $run->argv = $argv;
        $run->fingerprint = $fingerprint;
        $run->worker = $worker;
        $run->status = CommandRunStatus::Running;
        $run->frames = ProjectCommandFrame::collect([], DataCollection::class);
        $run->save();

        return $run;
    }

    // ----------[ Mutations ]----------

    public function recordProcess(int $pid): void
    {
        $this->pid = $pid;
        $this->saveAndAssert();
        $this->raise(new ProjectCommandProcessRecorded($this->id, $pid));
    }

    /**
     * @param  list<ProjectCommandFrame>  $frames
     */
    public function finish(array $frames, int $exitCode): void
    {
        $this->frames = ProjectCommandFrame::collect($frames, DataCollection::class);
        $this->exit_code = $exitCode;
        $this->status = $this->status->settledBy($exitCode);
        $this->saveAndAssert();
        $this->raise(new ProjectCommandFinished($this->id, $exitCode));
    }

    /**
     * Asks the run to stop; it reads cancelled once its process exited, not before.
     */
    public function requestCancellation(): void
    {
        $this->status = CommandRunStatus::CancellationRequested;
        $this->saveAndAssert();
        $this->raise(new ProjectCommandCancellationRequested($this->id));
    }

    /**
     * Ends the run for good, as when its binding is revoked: nothing of it is waited for.
     */
    public function cancel(): void
    {
        $this->status = CommandRunStatus::Cancelled;
        $this->saveAndAssert();
        $this->raise(new ProjectCommandCancelled($this->id));
    }

    /**
     * Settles a run whose worker is gone from what can still be proved: one whose recorded process still runs stays
     * as it is, one whose process ended unrecorded is interrupted, and one that never recorded its process is unknown.
     * A run is never started again from here.
     */
    public function reconcile(CommandRunEvidence $evidence): void
    {
        $settled = $this->settledStateBy($evidence);

        if ($settled === $this->status) {
            return;
        }

        $this->status = $settled;
        $this->saveAndAssert();
        $this->raise(new ProjectCommandReconciled($this->id, $settled));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the run may still be running: running, or asked to cancel and not yet stopped.
     */
    public function isRunning(): bool
    {
        return $this->status->isActive();
    }

    /**
     * Whether the request id was given for this operation: the same arguments, piped input, binding and agent.
     */
    public function isOfOperation(string $fingerprint): bool
    {
        return hash_equals($this->fingerprint, $fingerprint);
    }

    // ----------[ Transformers ]----------

    /**
     * Where the run stands by what can be proved now: as recorded while its worker lives or its recorded process
     * still runs; interrupted once that process ended unrecorded; unknown when it never recorded one.
     */
    public function settledStateBy(CommandRunEvidence $evidence): CommandRunStatus
    {
        if (! $this->isRunning() || $evidence->isWorkerAlive($this->worker)) {
            return $this->status;
        }

        if ($this->pid !== null && $evidence->isProcessAlive($this->pid)) {
            return $this->status;
        }

        if ($this->pid === null) {
            return CommandRunStatus::Unknown;
        }

        return CommandRunStatus::Interrupted;
    }

    /**
     * @return list<ProjectCommandFrame>
     */
    public function recordedFrames(): array
    {
        return $this->frames->items();
    }

    // ----------[ Queries ]----------

    /**
     * The run of this request id, locked until the transaction ends, if one was started.
     *
     * @return list<self>
     */
    public static function findLockedByRequest(string $requestKey): array
    {
        return array_values(self::query()->ofRequest($requestKey)->lockForUpdate()->limit(1)->get()->all());
    }

    /**
     * The run of this request id that this agent asked for on this binding, if there is one; another agent's or
     * another binding's is none.
     *
     * @return list<self>
     */
    public static function findForRequestBy(string $requestKey, string $agentId, string $bindingId): array
    {
        return array_values(
            self::query()->ofRequest($requestKey)->ofAgent($agentId)->ofBinding($bindingId)->limit(1)->get()->all(),
        );
    }

    /**
     * The binding's command streams that may still run, locked until the transaction ends; a binding runs a few at
     * once.
     *
     * @return list<self>
     */
    public static function findLockedRunningOf(ProjectBinding $binding): array
    {
        return array_values(self::query()->ofBinding($binding->id)->active()->lockForUpdate()
            ->readAll('a binding runs a few journal verbs at once')->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The run made under the request key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRequest(Builder $query, string $requestKey): void
    {
        $query->where('request_key', $requestKey);
    }

    /**
     * The agent's runs.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }

    /**
     * The binding's runs.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofBinding(Builder $query, string $bindingId): void
    {
        $query->where('binding_id', $bindingId);
    }

    /**
     * The runs still going.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->whereIn('status', CommandRunStatus::active());
    }
}
