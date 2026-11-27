<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Protocol\Data\HostChunkData;

/**
 * What a chunk of a process's output says beyond its fields: the bytes it printed, decoded from the base64 the host
 * sends them in, and the offset just past it in its stream.
 */
final readonly class HostChunks
{
    public static function printed(HostChunkData $chunk): string
    {
        return (string) base64_decode($chunk->bytes, true);
    }

    public static function end(HostChunkData $chunk): int
    {
        return $chunk->offset + strlen(self::printed($chunk));
    }

    /**
     * The offset just past the last stdout among the chunks, 0 when none is stdout.
     *
     * @param  list<HostChunkData>  $chunks
     */
    public static function stdoutThrough(array $chunks): int
    {
        $ends = array_map(fn (HostChunkData $chunk) => $chunk->stream === 'stdout' ? self::end($chunk) : 0, $chunks);

        return max([0, ...$ends]);
    }
}
