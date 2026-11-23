<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Files\Files;
use App\Contracts\Reads\OutputRecorder;
use App\Enums\Permissions;
use App\Enums\Place;
use App\Events\OutputChunkCommitted;
use App\Exceptions\FileExists;
use App\Exceptions\FileUnwritable;
use App\Exceptions\OutputStorageFailed;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Values\CapturedChunk;
use App\Values\FilePath;
use App\Values\OutputPosition;
use App\Values\PartEnd;

/**
 * Keeps every byte a part writes on the private process-output disk (doc 21 revision 6, section 54): each piece is
 * written append-only to its own file and synced before its row is created, so a row never points at bytes that are
 * not stored. Bytes are stored raw: binary data and carriage returns stay as written.
 */
final readonly class SpoolRecorder implements OutputRecorder
{
    public const string DISK = 'process-output';

    public function __construct(private Files $files, private CommandFacts $facts, private ManifestCheck $manifest) {}

    public function append(CapturedChunk $chunk): OutputPosition
    {
        $stream = $chunk->stream->value;
        $offset = $chunk->part->stream_offsets[$stream] ?? 0;

        $relative = "{$chunk->part->process_run_id}/{$chunk->part->id}/{$stream}/".str_pad(
            (string) $offset,
            20,
            '0',
            STR_PAD_LEFT,
        ).'.chunk';

        $this->write(FilePath::in(Place::ProcessOutput, $relative), $chunk->bytes);
        $stored = OutputChunk::create($chunk, $offset, $relative);
        $chunk->part->captureUpTo($stored);
        $this->facts->publishAfterCommit(new OutputChunkCommitted($chunk->part->id, $stream, $offset, $stored->length));

        return new OutputPosition($chunk->stream, $offset + $stored->length);
    }

    public function finish(PartRun $part, PartEnd $end): void
    {
        $part->markCapture($this->manifest->stateOf($part));
    }

    /**
     * Stores a chunk once: its folder is the owner's, and an existing chunk is never overwritten.
     *
     * @throws OutputStorageFailed
     */
    private function write(FilePath $chunk, string $bytes): void
    {
        try {
            $this->files->makeFolder($chunk->parent(), Permissions::OwnerOnly);
            $this->files->create($chunk, $bytes);
        } catch (FileExists|FileUnwritable $failure) {
            throw OutputStorageFailed::at($chunk->label(), 0, strlen($bytes), $failure);
        }
    }
}
