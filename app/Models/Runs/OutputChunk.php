<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\JournalModel;
use App\Processes\Enums\OutputStream;
use App\Records\Contracts\ReadableModel;
use App\Values\CapturedChunk;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $part_run_id
 * @property OutputStream $stream
 * @property int $offset
 * @property int $length
 * @property string $checksum
 * @property CarbonImmutable $captured_at
 * @property string $storage_path
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class OutputChunk extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stream' => OutputStream::class,
            'offset' => 'integer',
            'length' => 'integer',
            'captured_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The record of a captured chunk written to the spool at its offset in its stream.
     */
    public static function create(CapturedChunk $chunk, int $offset, string $storagePath): self
    {
        $outputChunk = new self();
        $outputChunk->part_run_id = $chunk->part->id;
        $outputChunk->stream = $chunk->stream;
        $outputChunk->offset = $offset;
        $outputChunk->length = strlen($chunk->bytes);
        $outputChunk->checksum = hash('sha256', $chunk->bytes);
        $outputChunk->captured_at = $chunk->capturedAt;
        $outputChunk->storage_path = $storagePath;
        $outputChunk->save();

        return $outputChunk;
    }

    // ----------[ Scopes ]----------

    /**
     * The chunks stream by stream, each in the order of its offset.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inStreamOrder(Builder $query): void
    {
        $query->orderBy('stream')->orderBy('offset');
    }

    /**
     * The rows of the given part run.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPartRun(Builder $query, string $runId): void
    {
        $query->where('part_run_id', $runId);
    }

    /**
     * The rows of the given stream.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withStream(Builder $query, OutputStream $stream): void
    {
        $query->where('stream', $stream);
    }

    /**
     * The rows of any of the given part runs.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofPartRuns(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('part_run_id', $ids);
    }

    /**
     * The rows by offset descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byOffsetDescending(Builder $query): void
    {
        $query->orderByDesc('offset');
    }

    /**
     * The rows by stream, then offset.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byStreamThenOffset(Builder $query): void
    {
        $query->orderBy('stream');
        $query->orderBy('offset');
    }

    /**
     * The rows by offset.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byOffset(Builder $query): void
    {
        $query->orderBy('offset');
    }

    /**
     * The chunks at or past the offset.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromOffset(Builder $query, int $offset): void
    {
        $query->where('offset', '>=', $offset);
    }
}
