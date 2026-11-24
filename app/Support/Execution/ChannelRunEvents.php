<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Calls\Processes\ProcessCalls;
use App\Calls\Processes\RunChunk;
use App\Calls\Processes\RunPart;
use App\Contracts\Events\RunEvents;
use App\Contracts\Files\Files;
use App\Enums\OutputStream;
use App\Enums\Permissions;
use App\Enums\RunEventType;
use App\Exceptions\CallFailed;
use App\Values\FilePath;
use App\Values\PartEnd;
use App\Values\PartKey;
use App\Values\RunEvent;
use Psr\Log\LoggerInterface;

/**
 * The host's side of a run's event channel: every event and output piece is first
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
        private readonly LoggerInterface $logger,
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
        } catch (CallFailed $failure) {
            return sprintf(
                'registry-unavailable: the journal could not confirm the rules this part was admitted under (%s: %s)',
                $failure::class,
                $failure->getMessage(),
            );
        }
    }

    public function runStopped(string $reason): void
    {
        $this->emit(RunEventType::RunStopped, null, reason: $reason);
    }

    /**
     * Spools the root status before anything is reported locally, signed with the run's event key like every event,
     * and sends it with the rest; it stays spooled until the journal accepted it.
     */
    public function runFinished(int $rootStatus): void
    {
        $this->append('events.jsonl', RunEvent::from([
            'sequence' => ++$this->sequence,
            'type' => RunEventType::RunFinished,
            'code' => $rootStatus,
        ]));
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
     * it spooled for the next one, and names its cause in the log.
     */
    public function flush(): void
    {
        try {
            $this->sendSpooled();
            $this->waitingToSend = false;
        } catch (CallFailed $failure) {
            $this->waitingToSend = true;

            $this->logger->warning('processes.run_events_not_sent', [
                'run_id' => $this->runId,
                'failure' => $failure::class,
                'message' => $failure->getMessage(),
                'exception' => $failure,
            ]);
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
        $events = array_values(RunEvent::collect(array_slice($this->spooledLines('events.jsonl'), $this->sent)));

        if ($events !== []) {
            $this->processes->recordRunEvents($this->runId, $this->eventKey, $events);
            $this->sent += count($events);
        }

        $chunks = $this->spooledLines('chunks.jsonl');

        foreach (RunChunk::collect($chunks) as $index => $chunk) {
            $this->processes->recordRunChunk($this->runId, $this->eventKey, $chunk);
            $rest = implode('', array_map(fn (string $left) => $left."\n", array_slice($chunks, $index + 1)));
            $this->files->write($this->spoolFolder->child('chunks.jsonl'), $rest);
        }
    }
}
