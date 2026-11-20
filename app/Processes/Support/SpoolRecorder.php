<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\OutputRecorder;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Exceptions\OutputStorageFailed;
use App\Processes\Models\OutputChunk;
use App\Processes\Models\PartRun;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\OutputPosition;
use App\Processes\Values\PartEnd;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * Keeps every byte a part writes on the private process-output disk (doc 21 revision 6, section 54): each piece is
 * written append-only to its own file and synced before its row is created, so a row never points at bytes that are
 * not stored. Bytes are stored raw: binary data and carriage returns stay as written.
 */
final readonly class SpoolRecorder implements OutputRecorder
{
    public const string DISK = 'process-output';

    public function __construct(private Factory $disks, private Dispatcher $events, private ManifestCheck $manifest) {}

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
        $this->write($this->disks->disk(self::DISK)->path($relative), $chunk->bytes);
        $stored = OutputChunk::create($chunk, $offset, $relative);
        $chunk->part->captureUpTo($stored);
        $this->events->dispatch(new OutputChunkCommitted($chunk->part->id, $stream, $offset, $stored->length));

        return new OutputPosition($chunk->stream, $offset + $stored->length);
    }

    public function finish(PartRun $part, PartEnd $end): void
    {
        $part->markCapture($this->manifest->stateOf($part));
    }

    /**
     * @throws OutputStorageFailed
     */
    private function write(string $path, string $bytes): void
    {
        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0700, true);
        }

        $file = is_file($path) ? false : fopen($path, 'xb');
        $written = $file === false ? 0 : (int) fwrite($file, $bytes);

        if ($file !== false) {
            fflush($file);
            fsync($file);
            fclose($file);
        }

        if ($written !== strlen($bytes)) {
            throw OutputStorageFailed::at($path, $written, strlen($bytes));
        }
    }
}
