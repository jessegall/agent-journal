<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\CleanupState;
use App\Enums\CleanupStep;
use App\Events\Sessions\CleanupPassRecorded;
use App\Models\Agents\AgentSession;
use App\Values\CleanupReport;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The durable removal of an ended container launch's transient resources on its host. It stays pending, and the host
 * retries it, until every resource is removed or found gone; only then is the launch's capacity released. A dirty
 * workspace is never removed: its place is kept as the recovery location.
 *
 * @property string $id
 * @property string $start_request_id
 * @property string $agent_session_id
 * @property string $host_id
 * @property list<string> $removed_steps
 * @property string|null $recovery_location
 * @property string|null $last_error
 * @property CleanupState $state
 * @property int $attempts
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('cleanup_operations')]
#[Fillable([
    'start_request_id',
    'agent_session_id',
    'host_id',
    'removed_steps',
    'recovery_location',
    'last_error',
    'state',
    'attempts',
])]
final class CleanupOperation extends Model implements EventSource, ReadableModel
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

    // ----------[ Getters ]----------

    public function isDone(): bool
    {
        return $this->state === CleanupState::Done;
    }

    // ----------[ Accessors ]----------

    /**
     * The resources the host has not removed yet.
     *
     * @return Attribute<list{0?: CleanupStep, 1?: CleanupStep, 2?: CleanupStep}, never>
     */
    protected function remainingSteps(): Attribute
    {
        return Attribute::get(fn () => array_values(array_filter(
            CleanupStep::cases(),
            fn (CleanupStep $step) => ! in_array($step->value, $this->removed_steps, true),
        )));
    }

    // ----------[ Internals ]----------

    private function stateAfterPass(): CleanupState
    {
        return match (true) {
            $this->remainingSteps === [] => CleanupState::Done,
            $this->attempts >= self::ATTEMPT_LIMIT => CleanupState::Failed,
            default => CleanupState::Pending,
        };
    }

    // ----------[ Queries ]----------

    /**
     * Opens the cleanup of the session's ended launch on its host; opening it again finds the same one.
     */
    public static function open(AgentSession $session, string $hostId): self
    {
        $operation = new self([
            'start_request_id' => $session->start_request_id,
            'agent_session_id' => $session->id,
            'host_id' => $hostId,
            'removed_steps' => [],
            'state' => CleanupState::Pending,
        ]);

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
