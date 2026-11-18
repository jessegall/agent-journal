<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Support\BypassReport;
use App\Agents\Support\LoggedBypass;
use App\Links\Support\Linkable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One hook call the host answered on its own while the journal was unreachable, reported after recovery.
 *
 * @property string $id
 * @property string $agent_session_id
 * @property string $native_event
 * @property string $failure
 * @property CarbonImmutable $occurred_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['native_event', 'failure', 'occurred_at'])]
final class LaunchBypass extends Model
{
    use HasUlids, Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['occurred_at' => 'immutable_datetime'];
    }

    /**
     * Keeps every bypass of the report for the session in one insert.
     */
    public static function recordAll(string $sessionId, BypassReport $report): void
    {
        $now = CarbonImmutable::now();

        self::query()->insert(array_map(fn (LoggedBypass $fact) => [
            'id' => (new self)->newUniqueId(),
            'agent_session_id' => $sessionId,
            'native_event' => $fact->nativeEvent,
            'failure' => $fact->failure,
            'occurred_at' => $fact->occurredAt,
            'created_at' => $now,
            'updated_at' => $now,
        ], $report->bypasses));
    }
}
