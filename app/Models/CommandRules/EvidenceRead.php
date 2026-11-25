<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\ReadableModel;
use App\Enums\CommandRules\EvidenceSource;
use App\Models\Runs\ProcessRun;
use App\Models\Support\BelongsToProject;
use App\Support\ActorReference;
use App\Values\EvidenceRange;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $project_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $process_run_id
 * @property string $part_run_id
 * @property EvidenceSource $source
 * @property int $first_byte
 * @property int $end_byte
 * @property CarbonImmutable $read_at
 *
 * @mixin \Eloquent
 */
final class EvidenceRead extends Model implements ProjectOwned, ReadableModel
{
    use BelongsToProject;
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
    public static function createMany(ProcessRun $run, ActorReference $reader, array $ranges): array
    {
        $reads = array_map(function (EvidenceRange $range) use ($run, $reader): self {
            $read = new self();
            $read->project_id = $run->project_id;
            $read->actor_type = $reader->type;
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

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRunReadBy(Builder $query, ProcessRun $run, ActorReference $reader): void
    {
        $query->where('process_run_id', $run->id)
            ->where('actor_type', $reader->type)
            ->where('actor_id', $reader->id);
    }
}
