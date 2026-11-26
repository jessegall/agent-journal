<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\JournalModel;
use App\Processes\Values\ProcessEventFacts;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $process_run_id
 * @property int $sequence
 * @property string $type
 * @property ProcessEventFacts $payload
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class ProcessEvent extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    public const string OPERATIONAL_ERROR = 'operational_error';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sequence' => 'integer',
            'payload' => ProcessEventFacts::class,
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(ProcessRun $run, int $sequence, ProcessEventFacts $facts): self
    {
        $existing = self::findAtSequence($run, $sequence);

        if ($existing === null) {
            return self::createAt($run, $sequence, $facts);
        }

        if ($existing->payload->toArray() === $facts->toArray()) {
            return $existing;
        }

        $next = self::resolveNextSequence($run);

        return self::createAt($run, $next, ProcessEventFacts::conflict($sequence, $facts));
    }

    // ----------[ Internals ]----------

    private static function createAt(ProcessRun $run, int $sequence, ProcessEventFacts $facts): self
    {
        $processEvent = new self();
        $processEvent->process_run_id = $run->id;
        $processEvent->sequence = $sequence;
        $processEvent->type = $facts->type;
        $processEvent->payload = $facts;
        $processEvent->save();

        return $processEvent;
    }

    // ----------[ Queries ]----------

    /**
     * The run's event at this sequence; none before it.
     */
    public static function findAtSequence(ProcessRun $run, int $sequence): self|null
    {
        return self::query()->ofRun($run)->atSequence($sequence)->first();
    }

    /**
     * The sequence the run's next event takes: one past its newest.
     */
    public static function resolveNextSequence(ProcessRun $run): int
    {
        return (int) self::query()->ofRun($run)->max('sequence') + 1;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRun(Builder $query, ProcessRun $run): void
    {
        $query->where('process_run_id', $run->id);
    }

    /**
     * The event at that place in its run.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function atSequence(Builder $query, int $sequence): void
    {
        $query->where('sequence', $sequence);
    }
}
