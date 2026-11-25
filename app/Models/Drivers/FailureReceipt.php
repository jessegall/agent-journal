<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Drivers\DriverFailure;
use App\Support\Inputs\Values\HookIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $event_id
 * @property DriverFailure $failure
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
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

    // ----------[ Constructors ]----------

    /**
     * Keeps the failure the hook reported unless its event was already received, and answers whether it is new.
     */
    public static function create(HookIdentity $hook, DriverFailure $failure): bool
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
