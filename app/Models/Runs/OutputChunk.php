<?php

declare(strict_types=1);

namespace App\Models\Runs;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\OutputStream;
use App\Values\CapturedChunk;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One stored piece of a part's output stream: where it starts, how long it is, its checksum and the file that holds
 * it. A stream's chunks in offset order with their checksums are its manifest.
 *
 * @property string $id
 * @property string $part_run_id
 * @property OutputStream $stream
 * @property int $offset
 * @property int $length
 * @property string $checksum
 * @property CarbonImmutable $captured_at
 * @property string $storage_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['part_run_id', 'stream', 'offset', 'length', 'checksum', 'captured_at', 'storage_path'])]
final class OutputChunk extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
        return self::query()->create([
            'part_run_id' => $chunk->part->id,
            'stream' => $chunk->stream,
            'offset' => $offset,
            'length' => strlen($chunk->bytes),
            'checksum' => hash('sha256', $chunk->bytes),
            'captured_at' => $chunk->capturedAt,
            'storage_path' => $storagePath,
        ]);
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
}
