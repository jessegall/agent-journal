<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Enums\CaptureState;
use App\Processes\Models\OutputChunk;
use App\Processes\Models\PartRun;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Collection;

/**
 * Checks a part's stored output against its manifest: each stream's pieces run on from offset 0 with no gap, every
 * stored file still matches its checksum, and each stream ends where the recorder counted. A gap is Incomplete, a
 * changed file Corrupt.
 */
final readonly class ManifestCheck
{
    public function __construct(private Factory $disks) {}

    public function stateOf(PartRun $part): CaptureState
    {
        $disk = $this->disks->disk(SpoolRecorder::DISK);
        $next = [];
        $state = CaptureState::Complete;
        OutputChunk::query()->where(
            'part_run_id',
            $part->id,
        )->orderBy('stream')->orderBy('offset')->readInChunks(500, function (
            Collection $chunks,
        ) use ($disk, &$next, &$state): void {
            foreach ($chunks as $chunk) {
                $stream = $chunk->stream->value;
                $path = $disk->path($chunk->storage_path);

                if ($chunk->offset !== ($next[$stream] ?? 0) || ! is_file($path)) {
                    $state = $state === CaptureState::Corrupt ? $state : CaptureState::Incomplete;
                } elseif (hash_file('sha256', $path) !== $chunk->checksum) {
                    $state = CaptureState::Corrupt;
                }
                $next[$stream] = $chunk->offset + $chunk->length;
            }
        });

        foreach ($part->stream_offsets as $stream => $counted) {
            if (($next[$stream] ?? 0) !== $counted) {
                $state = $state === CaptureState::Corrupt ? $state : CaptureState::Incomplete;
            }
        }

        return $state;
    }
}
