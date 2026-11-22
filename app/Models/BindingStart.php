<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Events\BindingStartRecorded;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One start of a binding's main runtime, by the durable id its device chose before launching anything, and the
 * session and runtime it opened: a start asked again under the same id answers them, never a second runtime.
 *
 * @property string $id
 * @property string $binding_id
 * @property string $start_id
 * @property string $session_id
 * @property string $runtime_id
 * @property CarbonImmutable|null $created_at
 */
#[Fillable(['binding_id', 'start_id', 'session_id', 'runtime_id'])]
final class BindingStart extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const ?string UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['created_at' => 'immutable_datetime'];
    }

    /**
     * Records the start under its id with the runtime it opened.
     */
    public static function create(string $bindingId, string $startId, string $sessionId, string $runtimeId): self
    {
        $start = new self();
        $start->binding_id = $bindingId;
        $start->start_id = $startId;
        $start->session_id = $sessionId;
        $start->runtime_id = $runtimeId;
        $start->assertSaved($start->save());
        $start->raise(new BindingStartRecorded($bindingId, $startId, $runtimeId, CarbonImmutable::now()));

        return $start;
    }

    // ----------[ Queries ]----------

    /**
     * The start of the binding under this id, none or one.
     *
     * @return list<self>
     */
    public static function ofBinding(string $bindingId, string $startId): array
    {
        return array_values(self::query()->where('binding_id', $bindingId)->where('start_id', $startId)->limit(1)
            ->get()->all());
    }
}
