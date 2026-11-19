<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Enums\OutputStream;
use App\Processes\Values\CapturedChunk;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
    use HasUlids, Linkable;

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

    /**
     * The record of a captured chunk written to the spool at its offset in its stream.
     */
    public static function record(CapturedChunk $chunk, int $offset, string $storagePath): self
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
}
