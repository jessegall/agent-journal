<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Sessions\CleanupState;
use App\Enums\Sessions\CleanupStep;
use App\Events\Sessions\CleanupPassRecorded;
use App\Models\Agents\AgentSession;
use App\Values\CleanupReport;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $start_request_id
 * @property string $agent_session_id
 * @property string $host_id
 * @property array $removed_steps
 * @property ?string $recovery_location
 * @property ?string $last_error
 * @property CleanupState $state
 * @property int $attempts
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Table('session_cleanups')]
final class SessionCleanup extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * How many failed passes a cleanup takes before it stops retrying and needs attention.
     */
    public const int ATTEMPT_LIMIT = 5;

    /**
     * @return array<string, string>
     *
     * @column removed_steps list<string>
     */
    protected function casts(): array
    {
        return [
            'removed_steps' => 'array',
            'state' => CleanupState::class,
            'attempts' => 'integer',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Records one pass of the host: the removed resources add to those removed before, a kept workspace becomes the
     * recovery location, and a failure counts an attempt. A pass on a finished cleanup changes nothing.
     */
    public function recordPass(CleanupReport $report): void
    {
        if ($this->state !== CleanupState::Pending) {
            return;
        }

        $removed = array_map(fn (CleanupStep $step) => $step->value, $report->removedSteps);
        $this->removed_steps = array_values(array_unique([
            ...$this->removed_steps,
            ...$removed,
        ]));
        $this->recovery_location = $report->keptWorkspace ?? $this->recovery_location;
        $this->last_error = $report->failure;
        $this->attempts += $report->hasFailed() ? 1 : 0;
        $this->state = $this->stateAfterPass();
        $this->assertSaved($this->save());
        $this->raise(new CleanupPassRecorded($this->id, $this->state));
    }

    // ----------[ Predicates ]----------

    public function isDone(): bool
    {
        return $this->state === CleanupState::Done;
    }

    // ----------[ Transformers ]----------

    /**
     * The resources the host has not removed yet.
     *
     * @return list{0?: CleanupStep, 1?: CleanupStep, 2?: CleanupStep}
     */
    public function remainingSteps(): array
    {
        return array_values(array_filter(
            CleanupStep::cases(),
            fn (CleanupStep $step) => ! in_array($step->value, $this->removed_steps, true),
        ));
    }

    // ----------[ Internals ]----------

    private function stateAfterPass(): CleanupState
    {
        return match (true) {
            $this->remainingSteps() === [] => CleanupState::Done,
            $this->attempts >= self::ATTEMPT_LIMIT => CleanupState::Failed,
            default => CleanupState::Pending,
        };
    }

    // ----------[ Queries ]----------

    /**
     * Opens the cleanup of the session's ended start on its host; opening it again finds the same one.
     */
    public static function open(AgentSession $session, string $hostId): self
    {
        $operation = new self();
        $operation->start_request_id = $session->start_request_id;
        $operation->agent_session_id = $session->id;
        $operation->host_id = $hostId;
        $operation->removed_steps = [];
        $operation->state = CleanupState::Pending;

        $operation->setAttribute($operation->getKeyName(), $operation->newUniqueId());
        $operation->insertIfAbsent();

        return self::query()->ofStartRequest($session->start_request_id)->sole();
    }

    /**
     * The cleanups the host still owes, oldest first.
     *
     * @return list<self>
     */
    public static function pendingOn(string $hostId, int $limit): array
    {
        $pending = self::query()
            ->onHost($hostId)
            ->pending()
            ->oldestFirst()
            ->readExactly($limit)
            ->get();

        return array_values($pending->all());
    }

    public static function ofSessionOn(string $hostId, string $sessionId): self
    {
        return self::query()->onHost($hostId)->ofSession($sessionId)->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * The start request's cleanup.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofStartRequest(Builder $query, string $startRequestId): void
    {
        $query->where('start_request_id', $startRequestId);
    }

    /**
     * The cleanups on the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onHost(Builder $query, string $hostId): void
    {
        $query->where('host_id', $hostId);
    }

    /**
     * The cleanups still to do.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pending(Builder $query): void
    {
        $query->where('state', CleanupState::Pending);
    }

    /**
     * The session's cleanup.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->where('agent_session_id', $sessionId);
    }

    /**
     * The cleanups oldest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function oldestFirst(Builder $query): void
    {
        $query->orderBy('created_at');
    }
}
