<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $process_run_id
 * @property int $sequence
 * @property string $type
 * @property array $payload
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'process_run_id',
    'sequence',
    'type',
    'payload',
])]
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
            'payload' => 'array',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * @param  array<string, mixed>  $fields
     */
    public static function create(ProcessRun $run, int $sequence, string $type, array $fields): self
    {
        $existing = self::query()->ofRun($run)->atSequence($sequence)->first();

        if ($existing === null) {
            return self::query()->create(
                [
                    'process_run_id' => $run->id,
                    'sequence' => $sequence,
                    'type' => $type,
                    'payload' => $fields,
                ],
            );
        }

        if ($existing->type === $type && $existing->payload === $fields) {
            return $existing;
        }

        $next = (int) self::query()->ofRun($run)->max('sequence') + 1;

        return self::query()->create(
            [
                'process_run_id' => $run->id,
                'sequence' => $next,
                'type' => self::OPERATIONAL_ERROR,
                'payload' => [
                    'conflicts_with' => $sequence,
                    'type' => $type,
                    'payload' => $fields,
                ],
            ],
        );
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
