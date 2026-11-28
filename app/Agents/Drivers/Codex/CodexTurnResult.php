<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Accounts\Data\CodexEventData;
use App\Agents\Drivers\Contracts\TurnResult;
use App\Values\TurnEnd;
use Carbon\CarbonImmutable;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * What one `codex exec --json` turn printed, read chunk by chunk as it arrives: the thread it started, which the next
 * turn resumes, how its turn ended, and the error Codex gave when it failed. Nothing else of the output is kept.
 */
final class CodexTurnResult implements TurnResult
{
    /**
     * The part of the output after its last newline, kept until the rest of its line arrives.
     */
    private string $partial = '';

    private string|null $thread = null;

    private string|null $status = null;

    private string|null $error = null;

    /**
     * Reads the bytes printed next; an exec turn reports no usage the journal records.
     *
     * @return list<never>
     */
    public function read(string $bytes, CarbonImmutable $now): array
    {
        $lines = explode("\n", $this->partial.$bytes);
        $this->partial = (string) array_pop($lines);

        foreach ($lines as $line) {
            $this->readLine($line);
        }

        return [];
    }

    /**
     * The thread the turn started, so the next turn resumes it; none for a turn that resumed one.
     */
    public function conversation(): string|null
    {
        return $this->thread;
    }

    /**
     * The turn as the host saw it end, with the error Codex gave in place of the host's when it gave one.
     */
    public function end(int|null $exitCode, string|null $problem = null): TurnEnd
    {
        return new TurnEnd(exitCode: $exitCode, codexStatus: $this->status, problem: $this->error ?? $problem);
    }

    private function readLine(string $line): void
    {
        try {
            $event = CodexEventData::from(json_decode($line, true, 64, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return;
        }

        match ($event->type) {
            'thread.started' => $this->thread = $event->threadId,
            'turn.completed' => $this->status = 'completed',
            'turn.failed' => $this->fail($event->error?->message),
            'error' => $this->error = $event->message,
            default => null,
        };
    }

    private function fail(string|null $message): void
    {
        $this->status = 'failed';
        $this->error = $message ?? $this->error;
    }
}
