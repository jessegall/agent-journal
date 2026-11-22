<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\RuntimeEventType;
use App\Agents\Values\RecordedEvent;
use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One numbered report of a runtime's generation, kept once by its sequence, so a report the host sends again is
 * taken once and a report that arrives after a missing one is known to.
 *
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $generation
 * @property int $sequence
 * @property RuntimeEventType $event_type
 * @property string|null $driver_request_id
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Table('runtime_events')]
#[Fillable(['agent_runtime_id', 'generation', 'sequence', 'event_type', 'driver_request_id'])]
final class RuntimeEvent extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'generation' => 'integer',
            'sequence' => 'integer',
            'event_type' => RuntimeEventType::class,
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * Keeps the report under its sequence unless that sequence is kept already, and says whether reports of its
     * generation are missing between it and the one before; the first report of a generation follows none. Called under the runtime's lock, so its reports are numbered one at a time.
     */
    public static function record(
        AgentRuntime $runtime,
        int $generation,
        int $sequence,
        RuntimeEventType $type,
        string|null $requestId,
    ): RecordedEvent {
        $previous = self::query()
            ->where('agent_runtime_id', $runtime->id)
            ->where('generation', $generation)
            ->where('sequence', '<', $sequence)
            ->max('sequence');

        $event = new self();
        $event->id = $event->newUniqueId();
        $event->agent_runtime_id = $runtime->id;
        $event->generation = $generation;
        $event->sequence = $sequence;
        $event->event_type = $type;
        $event->driver_request_id = $requestId;

        return new RecordedEvent(! $event->insertIfAbsent(), $previous !== null && $sequence > ((int) $previous) + 1);
    }
}
