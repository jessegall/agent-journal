<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Values\ProcessEventFacts;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

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
final class ProcessEvent extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
        $existing = self::query()->ofRun($run)->atSequence($sequence)->first();

        if ($existing === null) {
            return self::createAt($run, $sequence, $facts);
        }

        if ($existing->payload->toArray() === $facts->toArray()) {
            return $existing;
        }

        $next = (int) self::query()->ofRun($run)->max('sequence') + 1;

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
