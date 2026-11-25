<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\EvidenceSource;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\EvidenceRange;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A receipt that an actor read part of a run's stored output: the envelope or
 * one byte range of one stream, so a reader is proven only after its author looked at the real evidence (story 202).
 *
 * @property string $id
 * @property string $project_key
 * @property string $actor_type
 * @property string $actor_id
 * @property string $process_run_id
 * @property string $part_run_id
 * @property EvidenceSource $source
 * @property int $first_byte
 * @property int $end_byte
 * @property Carbon $read_at
 */
#[Fillable([
    'project_key',
    'actor_type',
    'actor_id',
    'process_run_id',
    'part_run_id',
    'source',
    'first_byte',
    'end_byte',
])]
final class EvidenceRead extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;

    public const string CREATED_AT = 'read_at';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'source' => EvidenceSource::class,
            'first_byte' => 'integer',
            'end_byte' => 'integer',
            'read_at' => 'datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Records the reader's read of each range of the run, in one insert.
     *
     * @param  list<EvidenceRange>  $ranges
     */
    public static function create(ProcessRun $run, ActorIdentity $reader, array $ranges): void
    {
        self::createAll(array_map(fn (EvidenceRange $range) => new self([
            'project_key' => $run->project_key,
            'actor_type' => $reader->type->value,
            'actor_id' => $reader->id,
            'process_run_id' => $run->id,
            'part_run_id' => $range->partRunId,
            'source' => $range->source,
            'first_byte' => $range->firstByte,
            'end_byte' => $range->endByte,
        ]), $ranges));
    }

    // ----------[ Queries ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRunReadBy(Builder $query, ProcessRun $run, ActorIdentity $reader): void
    {
        $query->where('process_run_id', $run->id)
            ->where('actor_type', $reader->type->value)
            ->where('actor_id', $reader->id);
    }
}
