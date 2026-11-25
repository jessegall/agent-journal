<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\CommandRules\EvidenceSource;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\EvidenceRange;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
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
     * @return list<string> the ids of the rows written
     */
    public static function createMany(ProcessRun $run, ActorIdentity $reader, array $ranges): array
    {
        $reads = array_map(function (EvidenceRange $range) use ($run, $reader): self {
            $read = new self();
            $read->project_key = $run->project_key;
            $read->actor_type = $reader->type->value;
            $read->actor_id = $reader->id;
            $read->process_run_id = $run->id;
            $read->part_run_id = $range->partRunId;
            $read->source = $range->source;
            $read->first_byte = $range->firstByte;
            $read->end_byte = $range->endByte;

            return $read;
        }, $ranges);

        return self::insertRows($reads);
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
