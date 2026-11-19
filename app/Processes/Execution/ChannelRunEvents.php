<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\AgentRequests\Exceptions\CallFailed;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Contracts\RunEvents;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RunEventType;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use App\Processes\Values\RunEvent;

/**
 * The host's side of a run's event channel (doc 21 revision 6, section 53): every event and output piece is first
 * written to a spool file in the run's folder, then sent signed with the launch token and the run's event key. What a
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
        private readonly AgentRequestSender $journal,
        private readonly ProcessCalls $processes,
        private readonly string $runId,
        private readonly string $eventKey,
        private readonly string $spoolFolder,
    ) {
        if (! is_dir($spoolFolder)) {
            mkdir($spoolFolder, 0700, true);
        }
    }

    public function queued(PartKey $part): void
    {
        $this->emit(RunEventType::PartQueued, $part);
    }

    public function started(PartKey $part, int $pid, string $host): void
    {
        $this->emit(RunEventType::PartStarted, $part, ['pid' => $pid, 'host' => $host]);
    }

    public function startedInside(PartKey $part, string $host): void
    {
        $this->emit(RunEventType::PartStartedInside, $part, ['host' => $host]);
    }

    public function output(PartKey $part, OutputStream $stream, string $bytes): void
    {
        $key = "{$part->name()}:{$stream->value}";
        $offset = $this->offsets[$key] ?? 0;
        $this->offsets[$key] = $offset + strlen($bytes);
        $this->append('chunks.jsonl', [
            'part' => ['node' => $part->node, 'attempt' => $part->attempt, 'operation' => $part->operation],
            'stream' => $stream->value,
            'offset' => $offset,
            'bytes' => base64_encode($bytes),
        ]);
    }

    public function ended(PartKey $part, PartEnd $end, bool $drained): void
    {
        $this->emit(RunEventType::PartEnded, $part, [
            'end' => $end->type->value,
            'code' => $end->code,
            'reason' => $end->reason,
            'drained' => (int) $drained,
        ]);
    }

    public function skipped(PartKey $part, string $controllingResult): void
    {
        $this->emit(RunEventType::PartSkipped, $part, ['because' => $controllingResult]);
    }

    public function spawnFailed(PartKey $part, string $reason): void
    {
        $this->emit(RunEventType::PartStartFailed, $part, ['reason' => $reason]);
    }

    public function stopped(PartKey $part, string $reason): void
    {
        $this->emit(RunEventType::PartStopped, $part, ['reason' => $reason]);
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
        $this->emit(RunEventType::RunStopped, null, ['reason' => $reason]);
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
        } catch (AgentRequestFailed) {
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
     * @param  array<string, string|int>  $details
     */
    private function emit(RunEventType $type, PartKey|null $part, array $details = []): void
    {
        $this->append('events.jsonl', new RunEvent(++$this->sequence, $type, $part, $details)->toArray());
    }

    /**
     * Appends one JSON line to a spool file and sends what waits.
     *
     * @param  array<string, mixed>  $record
     */
    private function append(string $file, array $record): void
    {
        $line = json_encode($record, JSON_THROW_ON_ERROR)."\n";
        file_put_contents("{$this->spoolFolder}/{$file}", $line, FILE_APPEND | LOCK_EX);
        $this->flush();
    }

    /**
     * @return list<string>
     */
    private function spooledLines(string $name): array
    {
        $lines = is_file($this->spoolFolder.'/'.$name) ? file($this->spoolFolder.'/'.$name, FILE_IGNORE_NEW_LINES) : [];

        return $lines === false ? [] : $lines;
    }

    /**
     * @throws AgentRequestFailed
     */
    private function sendSpooled(): void
    {
        $lines = $this->spooledLines('events.jsonl');
        $decoded = array_map(fn (string $line) => json_decode($line, true, 512, JSON_THROW_ON_ERROR), $lines);
        $events = array_slice($decoded, $this->sent);
        if ($events !== []) {
            $path = "/agent/processes/runs/{$this->runId}/events";
            $this->journal->send($path, ['key' => $this->eventKey, 'events' => $events]);
            $this->sent += count($events);
        }
        $chunks = $this->spooledLines('chunks.jsonl');
        foreach ($chunks as $index => $line) {
            $chunk = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
            $this->journal->send("/agent/processes/runs/{$this->runId}/chunks", ['key' => $this->eventKey, ...$chunk]);
            $rest = implode('', array_map(fn (string $left) => $left."\n", array_slice($chunks, $index + 1)));
            file_put_contents($this->spoolFolder.'/chunks.jsonl', $rest, LOCK_EX);
        }
    }
}
