<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\AgentRequests\Exceptions\CallFailed;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Values\FilePath;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Calls\RunChunk;
use App\Processes\Calls\RunPart;
use App\Processes\Contracts\RunEvents;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RunEventType;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use App\Processes\Values\RunEvent;

/**
 * The host's side of a run's event channel (doc 21 revision 6, section 53): every event and output piece is first
 * written to a spool file in the run's folder, then sent signed with the start token and the run's event key. What a
 * lost connection kept back is sent again, in order, with the next send; the server ignores repeats.
 */
final class ChannelRunEvents implements RunEvents
{
    private const int HEARTBEAT_SECONDS = 5;

    private int $sequence = 0;

    private int $sent = 0;

    private float $lastHeartbeat = 0.0;

    private bool $waitingToSend = false;

    /**
     * @var array<string, int>
     */
    private array $offsets = [];

    public function __construct(
        private readonly ProcessCalls $processes,
        private readonly string $runId,
        private readonly string $eventKey,
        private readonly FilePath $spoolFolder,
        private readonly Files $files,
    ) {}

    public function queued(PartKey $part): void
    {
        $this->emit(RunEventType::PartQueued, $part);
    }

    public function started(PartKey $part, int $pid, string $host): void
    {
        $this->emit(RunEventType::PartStarted, $part, pid: $pid, host: $host);
    }

    public function startedInside(PartKey $part, string $host): void
    {
        $this->emit(RunEventType::PartStartedInside, $part, host: $host);
    }

    public function output(PartKey $part, OutputStream $stream, string $bytes): void
    {
        $key = "{$part->name()}:{$stream->value}";
        $offset = $this->offsets[$key] ?? 0;
        $this->offsets[$key] = $offset + strlen($bytes);
        $this->append('chunks.jsonl', new RunChunk(RunPart::of($part), $stream, $offset, base64_encode($bytes)));
    }

    public function ended(PartKey $part, PartEnd $end, bool $drained): void
    {
        $this->emit(RunEventType::PartEnded, $part, end: $end, drained: $drained);
    }

    public function skipped(PartKey $part, string $controllingResult): void
    {
        $this->emit(RunEventType::PartSkipped, $part, because: $controllingResult);
    }

    public function spawnFailed(PartKey $part, string $reason): void
    {
        $this->emit(RunEventType::PartStartFailed, $part, reason: $reason);
    }

    public function stopped(PartKey $part, string $reason): void
    {
        $this->emit(RunEventType::PartStopped, $part, reason: $reason);
    }

    public function lost(PartKey $part): void
    {
        $this->emit(RunEventType::PartLost, $part);
    }

    public function staleReason(PartKey $part): string
    {
        try {
            return $this->processes->checkRunCurrency($this->runId, $this->eventKey)->staleReason;
        } catch (CallFailed) {
            return 'registry-unavailable: the journal could not confirm the rules this part was admitted under';
        }
    }

    public function runStopped(string $reason): void
    {
        $this->emit(RunEventType::RunStopped, null, reason: $reason);
    }

    /**
     * Sends a heartbeat when the last one is older than the heartbeat interval.
     */
    public function beat(): void
    {
        if (microtime(true) - $this->lastHeartbeat >= self::HEARTBEAT_SECONDS) {
            $this->lastHeartbeat = microtime(true);
            $this->emit(RunEventType::Heartbeat, null);
        }
    }

    /**
     * Sends everything spooled and not yet accepted, events in order and output pieces in order; a failed send leaves
     * it spooled for the next one.
     */
    public function flush(): void
    {
        try {
            $this->sendSpooled();
            $this->waitingToSend = false;
        } catch (CallFailed) {
            $this->waitingToSend = true;
        }
    }

    /**
     * Whether the last send failed, so events wait in the spool.
     */
    public function isWaitingToSend(): bool
    {
        return $this->waitingToSend;
    }

    /**
     * Spools one event with the facts its type carries.
     */
    private function emit(
        RunEventType $type,
        PartKey|null $part,
        int|null $pid = null,
        string|null $host = null,
        PartEnd|null $end = null,
        bool|null $drained = null,
        string|null $because = null,
        string|null $reason = null,
    ): void {
        $this->append('events.jsonl', RunEvent::from([
            'sequence' => ++$this->sequence,
            'type' => $type,
            'part' => $part === null ? null : RunPart::of($part),
            'pid' => $pid,
            'host' => $host,
            'end' => $end?->type,
            'code' => $end?->code,
            'reason' => $end === null ? $reason : $end->reason,
            'drained' => $drained,
            'because' => $because,
        ]));
    }

    /**
     * Appends one JSON line to a spool file and sends what waits.
     */
    private function append(string $file, RunEvent|RunChunk $record): void
    {
        $this->files->makeFolder($this->spoolFolder, Permissions::OwnerOnly);
        $this->files->append($this->spoolFolder->child($file), $record->toJson()."\n");
        $this->flush();
    }

    /**
     * @return list<string>
     */
    private function spooledLines(string $name): array
    {
        $file = $this->spoolFolder->child($name);

        if (! $this->files->exists($file)) {
            return [];
        }

        $bytes = $this->files->read($file);

        return $bytes === '' ? [] : explode("\n", rtrim($bytes, "\n"));
    }

    /**
     * @throws CallFailed
     */
    private function sendSpooled(): void
    {
        $events = array_values(array_slice(RunEvent::collect($this->spooledRecords('events.jsonl')), $this->sent));

        if ($events !== []) {
            $this->processes->recordRunEvents($this->runId, $this->eventKey, $events);
            $this->sent += count($events);
        }

        $chunks = $this->spooledLines('chunks.jsonl');

        foreach (RunChunk::collect($this->spooledRecords('chunks.jsonl')) as $index => $chunk) {
            $this->processes->recordRunChunk($this->runId, $this->eventKey, $chunk);
            $rest = implode('', array_map(fn (string $left) => $left."\n", array_slice($chunks, $index + 1)));
            $this->files->write($this->spoolFolder->child('chunks.jsonl'), $rest);
        }
    }

    /**
     * The records of a spool file, one for each line.
     *
     * @return list<array<string, mixed>>
     */
    private function spooledRecords(string $name): array
    {
        return array_map(
            fn (string $line): array => (array) json_decode($line, true, 512, JSON_THROW_ON_ERROR),
            $this->spooledLines($name),
        );
    }
}
