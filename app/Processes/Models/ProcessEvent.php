<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One numbered event of a run's supervisor, such as a part's start or end. The same event sent again is kept once;
 * a different event under a number already taken is kept as an operational error at the next number.
 *
 * @property string $id
 * @property string $process_run_id
 * @property int $sequence
 * @property string $type
 * @property array<string, mixed> $payload
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['process_run_id', 'sequence', 'type', 'payload'])]
final class ProcessEvent extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    public const string OPERATIONAL_ERROR = 'operational_error';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['sequence' => 'integer', 'payload' => 'array'];
    }

    /**
     * @param  array<string, mixed>  $fields
     */
    public static function record(ProcessRun $run, int $sequence, string $type, array $fields): self
    {
        $existing = self::query()->ofRun($run)->where('sequence', $sequence)->first();
        if ($existing === null) {
            return self::query()->create(
                ['process_run_id' => $run->id, 'sequence' => $sequence, 'type' => $type, 'payload' => $fields],
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
                'payload' => ['conflicts_with' => $sequence, 'type' => $type, 'payload' => $fields],
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
}
