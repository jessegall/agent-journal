<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Enums\CaptureState;
use App\Enums\Place;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Values\FilePath;
use Illuminate\Support\Collection;

/**
 * Checks a part's stored output against its manifest: each stream's pieces run on from offset 0 with no gap, every
 * stored file still matches its checksum, and each stream ends where the recorder counted. A gap is Incomplete, a
 * changed file Corrupt.
 */
final readonly class ManifestCheck
{
    public function __construct(private Files $files) {}

    public function stateOf(PartRun $part): CaptureState
    {
        $next = [];
        $state = CaptureState::Complete;

        OutputChunk::query()->where(
            'part_run_id',
            $part->id,
        )->orderBy('stream')->orderBy('offset')->readInChunks(500, function (
            Collection $chunks,
        ) use (&$next, &$state): void {
            foreach ($chunks as $chunk) {
                $stream = $chunk->stream->value;
                $stored = FilePath::in(Place::ProcessOutput, $chunk->storage_path);

                if ($chunk->offset !== ($next[$stream] ?? 0) || ! $this->files->exists($stored)) {
                    $state = $state === CaptureState::Corrupt ? $state : CaptureState::Incomplete;
                } elseif ($this->files->digest($stored) !== $chunk->checksum) {
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
