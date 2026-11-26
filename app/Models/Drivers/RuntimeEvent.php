<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Agents\Drivers\Values\RecordedEvent;
use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\JournalModel;
use App\Processes\Enums\RuntimeEventType;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $generation
 * @property int $sequence
 * @property RuntimeEventType $event_type
 * @property string|null $driver_request_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('runtime_events')]
final class RuntimeEvent extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use InsertsAbsentRows;
    use Linkable;

    protected function casts(): array
    {
        return [
            'generation' => 'integer',
            'sequence' => 'integer',
            'event_type' => RuntimeEventType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps the report under its sequence unless that sequence is kept already, and says whether reports of its
     * generation are missing between it and the one before; the first report of a generation follows none. Called under the runtime's lock, so its reports are numbered one at a time.
     */
    public static function create(
        AgentRuntime $runtime,
        int $generation,
        int $sequence,
        RuntimeEventType $type,
        string|null $requestId,
    ): RecordedEvent {
        $previous = self::resolvePreviousSequence($runtime, $generation, $sequence);

        $event = new self();
        $event->id = $event->newUniqueId();
        $event->agent_runtime_id = $runtime->id;
        $event->generation = $generation;
        $event->sequence = $sequence;
        $event->event_type = $type;
        $event->driver_request_id = $requestId;

        return new RecordedEvent(! $event->insertIfAbsent(), $previous !== null && $sequence > $previous + 1);
    }

    // ----------[ Queries ]----------

    /**
     * The newest sequence the runtime's generation recorded before this one; none before its first event.
     */
    public static function resolvePreviousSequence(AgentRuntime $runtime, int $generation, int $sequence): int|null
    {
        $previous = self::query()->ofGeneration($runtime, $generation)->before($sequence)->max('sequence');

        if ($previous === null) {
            return null;
        }

        return (int) $previous;
    }

    // ----------[ Scopes ]----------

    /**
     * The events of one generation of the runtime.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofGeneration(Builder $query, AgentRuntime $runtime, int $generation): void
    {
        $query->where('agent_runtime_id', $runtime->id)->where('generation', $generation);
    }

    /**
     * The events before that sequence number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function before(Builder $query, int $sequence): void
    {
        $query->where('sequence', '<', $sequence);
    }
}
