<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Hosts\HostPayloadJson;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostChunkPayload;
use App\Hosts\Protocol\Payloads\HostOutputPayload;

/**
 * A host's report of what a process printed, as a recording keeps it: its chunks carry their bytes in base64, so the
 * faker and the leak check read those bytes themselves, and a chunk faked to another length moves the offsets of the
 * process's later chunks by as much.
 */
final readonly class RecordedOutputReport
{
    private function __construct(public string $processId, private HostOutputPayload $report) {}

    /**
     * The report the call asks with, none for any other call.
     */
    public static function askedBy(RecordedCall $call): self|null
    {
        if ($call->status !== null || ! HostRoute::NotifyProcessOutput->matchesPath($call->path)) {
            return null;
        }

        return new self(explode('/', $call->path)[3], HostOutputPayload::from($call->body));
    }

    /**
     * What the chunks printed, one after the other.
     */
    public function printed(): string
    {
        return implode('', array_map(self::bytesOf(...), $this->report->chunks));
    }

    /**
     * The report with each chunk's bytes faked.
     */
    public function fakedBy(RecordingFakes $fakes): self
    {
        return $this->withChunks(array_map(
            fn (HostChunkPayload $chunk) => new HostChunkPayload(
                $chunk->stream,
                $chunk->offset,
                base64_encode($fakes->replaceIn(self::bytesOf($chunk))),
            ),
            $this->report->chunks,
        ));
    }

    /**
     * How many bytes longer each chunk of this report is than the same chunk of the report it was faked from.
     *
     * @return list<int>
     */
    public function lengthChangesFrom(self $real): array
    {
        return array_map(
            fn (int $faked, int $was) => $faked - $was,
            $this->chunkLengths(),
            $real->chunkLengths(),
        );
    }

    /**
     * The report with each chunk's offset moved by the shift given for it, in order.
     *
     * @param  list<int>  $shifts
     */
    public function shiftedBy(array $shifts): self
    {
        return $this->withChunks(array_map(
            fn (HostChunkPayload $chunk, int $shift) => new HostChunkPayload(
                $chunk->stream,
                $chunk->offset + $shift,
                $chunk->bytes,
            ),
            $this->report->chunks,
            $shifts,
        ));
    }

    public function body(): string
    {
        return HostPayloadJson::encode($this->report->toArray());
    }

    /**
     * How many bytes each chunk holds, in order.
     *
     * @return list<int>
     */
    private function chunkLengths(): array
    {
        return array_map(fn (HostChunkPayload $chunk) => strlen(self::bytesOf($chunk)), $this->report->chunks);
    }

    /**
     * @param  list<HostChunkPayload>  $chunks
     */
    private function withChunks(array $chunks): self
    {
        return new self($this->processId, new HostOutputPayload($this->report->frames, $chunks));
    }

    private static function bytesOf(HostChunkPayload $chunk): string
    {
        return (string) base64_decode($chunk->bytes, true);
    }
}
