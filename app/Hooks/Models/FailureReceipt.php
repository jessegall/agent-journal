<?php

declare(strict_types=1);

namespace App\Hooks\Models;

use App\Agents\Enums\ProgramFailure;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One failure a session's program reported, kept once per native event so a retried notification is recorded once.
 * Only the safe failure is kept, never the program's own error text; a request reads only its own session's.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $event_id
 * @property ProgramFailure $failure
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['event_id', 'failure'])]
final class FailureReceipt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'failure' => ProgramFailure::class,
        ];
    }

    // ----------[ Queries ]----------

    /**
     * Keeps the failure the hook reported unless its event was already received, and answers whether it is new.
     */
    public static function receive(HookIdentity $hook, ProgramFailure $failure): bool
    {
        $now = Carbon::now();

        return self::query()->withoutGlobalScope(AgentSessionScope::class)->insertOrIgnore([
            'id' => (string) Str::ulid(),
            'agent_id' => $hook->agentId,
            'session_id' => $hook->sessionId,
            'event_id' => $hook->hookId,
            'failure' => $failure->value,
            'created_at' => $now,
            'updated_at' => $now,
        ]) === 1;
    }
}
