<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Sessions\RetryAttemptSettled;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Values\RetrySchedule;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $agent_runtime_id
 * @property string|null $driver_request_id
 * @property string|null $host_process_id
 * @property RetriedAction $action
 * @property int|null $attempt_version
 * @property int $retry
 * @property int $wait_seconds
 * @property string $failure
 * @property string|null $evidence
 * @property CarbonImmutable $retry_at
 * @property RetryOutcome|null $outcome
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
final class RetryAttempt extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    protected function casts(): array
    {
        return [
            'action' => RetriedAction::class,
            'retry_at' => 'immutable_datetime',
            'outcome' => RetryOutcome::class,
        ];
    }

    // ----------[ Constructors ]----------

    /** Keeps the attempt and the point at which it can be tried. */
    public static function create(
        string $runtimeId,
        RetriedAction $action,
        int $retry,
        string $failure,
        CarbonImmutable $now,
        string|null $requestId = null,
        int|null $attemptVersion = null,
        string|null $processId = null,
    ): self {
        $attempt = new self();
        $attempt->agent_runtime_id = $runtimeId;
        $attempt->driver_request_id = $requestId;
        $attempt->attempt_version = $attemptVersion;
        $attempt->host_process_id = $processId;
        $attempt->action = $action;
        $attempt->retry = $retry;
        $attempt->wait_seconds = RetrySchedule::waitBefore($retry);
        $attempt->failure = $failure;
        $attempt->retry_at = $now->addSeconds($attempt->wait_seconds);
        $attempt->saveAndAssert();

        return $attempt;
    }

    // ----------[ Mutations ]----------

    /** Keeps the attempt's result and any evidence supplied by its handler. */
    public function settle(RetryOutcome $outcome, string|null $evidence = null): void
    {
        $this->outcome = $outcome;
        $this->evidence = $evidence;
        $this->saveAndAssert();
        $this->raise(new RetryAttemptSettled($this->id, $outcome));
    }

    // ----------[ Queries ]----------

    public static function findLatestOf(DriverRequest $request): self|null
    {
        return self::query()->ofRequest($request)->highestRetryFirst()->first();
    }

    public static function findForVersion(DriverRequest $request): self|null
    {
        if ($request->attempt_version === 0) {
            return null;
        }

        return self::query()
            ->ofRequest($request)
            ->atVersion($request->attempt_version)
            ->first();
    }

    // ----------[ Scopes ]----------

    /** @param Builder<self> $query */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->whereIn('agent_runtime_id', AgentRuntime::query()->ofSessions([$sessionId])->runtimeIds());
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function ofRequest(Builder $query, DriverRequest $request): void
    {
        $query->where('driver_request_id', $request->id);
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function atVersion(Builder $query, int $version): void
    {
        $query->where('attempt_version', $version);
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function highestRetryFirst(Builder $query): void
    {
        $query->orderByDesc('retry');
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function newestRecordedFirst(Builder $query): void
    {
        $query->latest('created_at');
    }
}
