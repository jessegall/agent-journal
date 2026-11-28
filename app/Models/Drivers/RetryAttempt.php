<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\JournalModel;
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
final class RetryAttempt extends JournalModel
{
    protected function casts(): array
    {
        return [
            'action' => RetriedAction::class,
            'retry_at' => 'immutable_datetime',
            'outcome' => RetryOutcome::class,
        ];
    }

    public static function record(
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
        $attempt->save();

        return $attempt;
    }

    public function settle(RetryOutcome $outcome, string|null $evidence = null): void
    {
        $this->outcome = $outcome;
        $this->evidence = $evidence;
        $this->save();
    }

    public static function latestOf(DriverRequest $request): self|null
    {
        return self::query()->where('driver_request_id', $request->id)->orderByDesc('retry')->first();
    }

    public static function ofVersion(DriverRequest $request): self|null
    {
        if ($request->attempt_version === 0) {
            return null;
        }

        return self::query()
            ->where('driver_request_id', $request->id)
            ->where('attempt_version', $request->attempt_version)
            ->first();
    }

    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->whereIn('agent_runtime_id', AgentRuntime::query()->ofSessions([$sessionId])->select('id'));
    }
}
