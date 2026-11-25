<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\DriverFailure;
use App\Support\Inputs\Values\HookIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $event_id
 * @property DriverFailure $failure
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'event_id',
    'failure',
])]
final class FailureReceipt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'failure' => DriverFailure::class,
        ];
    }

    // ----------[ Queries ]----------

    /**
     * Keeps the failure the hook reported unless its event was already received, and answers whether it is new.
     */
    public static function receive(HookIdentity $hook, DriverFailure $failure): bool
    {
        $receipt = new self();

        $receipt->setRawAttributes([
            'id' => $receipt->newUniqueId(),
            'agent_id' => $hook->agentId,
            'session_id' => $hook->sessionId,
            'event_id' => $hook->hookId,
            'failure' => $failure->value,
        ]);

        return $receipt->insertIfAbsent();
    }
}
