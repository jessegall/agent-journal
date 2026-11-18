<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Enums\OutputStream;
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
        return ['stream' => OutputStream::class, 'offset' => 'integer', 'length' => 'integer', 'captured_at' => 'immutable_datetime'];
    }
}
