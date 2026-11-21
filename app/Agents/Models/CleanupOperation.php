<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\CleanupState;
use App\Agents\Enums\CleanupStep;
use App\Agents\Values\CleanupReport;
use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
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
final class CleanupOperation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    /**
     * How many failed passes a cleanup takes before it stops retrying and needs attention.
     */
    public const int ATTEMPT_LIMIT = 5;

    // ----------[ Constructors ]----------

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

        return self::query()->where('start_request_id', $session->start_request_id)->sole();
    }

    /**
     * The cleanups the host still owes, oldest first.
     *
     * @return list<self>
     */
    public static function pendingOn(string $hostId, int $limit): array
    {
        $pending = self::query()
            ->where('host_id', $hostId)
            ->where('state', CleanupState::Pending)
            ->orderBy('created_at')
            ->readExactly($limit)
            ->get();

        return array_values($pending->all());
    }

    public static function ofSessionOn(string $hostId, string $sessionId): self
    {
        return self::query()->where('host_id', $hostId)->where('agent_session_id', $sessionId)->firstOrFail();
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
        $this->removed_steps = array_values(array_unique([...$this->removed_steps, ...$removed]));
        $this->recovery_location = $report->keptWorkspace ?? $this->recovery_location;
        $this->last_error = $report->failure;
        $this->attempts += $report->hasFailed() ? 1 : 0;
        $this->state = $this->stateAfterPass();
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isDone(): bool
    {
        return $this->state === CleanupState::Done;
    }

    /**
     * The resources the host has not removed yet.
     *
     * @return list<CleanupStep>
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
}
