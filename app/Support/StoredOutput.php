<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\OutputStream;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Values\OutputFrame;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Collection;

/**
 * Reads a part's stored output afterwards, without ever running its command again:
 * the raw bytes of a stream, its last lines, the offsets of a search, and a bounded preview that escapes control and
 * invalid bytes.
 */
final readonly class StoredOutput
{
    public const int PREVIEW_CHARACTER_LIMIT = 4_000;

    public function __construct(private Factory $disks) {}

    public function bytes(PartRun $part, OutputStream $stream): string
    {
        $disk = $this->disks->disk(SpoolRecorder::DISK);
        $bytes = '';

        OutputChunk::query()
            ->ofPartRun($part->id)
            ->withStream($stream->value)
            ->byOffset()
            ->readInChunks(200, function (Collection $chunks) use ($disk, &$bytes): void {
                foreach ($chunks as $chunk) {
                    $bytes .= (string) $disk->get($chunk->storage_path);
                }
            });

        return $bytes;
    }

    /**
     * The committed chunks of a part from an offset on, in order, as frames a reader takes; it never sees anything
     * but committed bytes.
     *
     * @return list<OutputFrame>
     */
    public function frames(PartRun $part, OutputStream $stream, int $fromOffset): array
    {
        $disk = $this->disks->disk(SpoolRecorder::DISK);
        $frames = [];

        OutputChunk::query()
            ->ofPartRun($part->id)
            ->withStream($stream->value)
            ->where('offset', '>=', $fromOffset)
            ->byOffset()
            ->readInChunks(200, function (Collection $chunks) use ($disk, $stream, &$frames): void {
                foreach ($chunks as $chunk) {
                    $frames[] = new OutputFrame($stream, $chunk->offset, (string) $disk->get($chunk->storage_path));
                }
            });

        return $frames;
    }

    /**
     * The last lines of a stream, how many bytes come before them and where they end.
     *
     * @return array{text: string, before: int, end: int}
     */
    public function tail(PartRun $part, OutputStream $stream, int $lines): array
    {
        $bytes = rtrim($this->bytes($part, $stream), "\n");
        $text = implode("\n", array_slice(explode("\n", $bytes), -$lines));

        return [
            'text' => $this->preview($text),
            'before' => strlen($bytes) - strlen($text),
            'end' => strlen($bytes),
        ];
    }

    /**
     * The byte offsets where a text occurs in a stream, at most a thousand.
     *
     * @return list<int>
     */
    public function search(PartRun $part, OutputStream $stream, string $needle): array
    {
        preg_match_all('/'.preg_quote($needle, '/').'/', $this->bytes($part, $stream), $matches, PREG_OFFSET_CAPTURE);

        return array_slice(array_column($matches[0], 1), 0, 1_000);
    }

    /**
     * Text safe to show: control bytes other than newline and tab, and bytes that are not UTF-8, written as \xNN, cut
     * to the preview length.
     */
    public function preview(string $bytes): string
    {
        $escape = fn (array $byte): string => sprintf('\x%02X', ord($byte[0]));
        $escaped = (string) preg_replace_callback('/[\x00-\x08\x0B-\x1F\x7F]/', $escape, $bytes);

        if (! mb_check_encoding($escaped, 'UTF-8')) {
            $escaped = (string) preg_replace_callback('/[\x80-\xFF]/', $escape, $escaped);
        }

        return mb_substr($escaped, 0, self::PREVIEW_CHARACTER_LIMIT);
    }
}
