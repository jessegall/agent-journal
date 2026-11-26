<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Attributes\Rules\DecodesAnyJson;
use App\Contracts\Drivers\TurnResult;
use App\Values\ThreadTokens;
use App\Values\TurnEnd;
use App\Values\UsageSource;
use Carbon\CarbonImmutable;

/**
 * What a Codex exec turn printed as --json events, read chunk by chunk as it arrives: the thread it started or
 * resumed, the tokens each completed turn used, and the status the turn ended with. Nothing else of the output is
 * kept.
 */
final class CodexResult implements TurnResult
{
    /**
     * The part of the output after its last newline, kept until the rest of its line arrives.
     */
    private string $partial = '';

    private int $lines = 0;

    private string|null $thread = null;

    private string|null $status = null;

    /**
     * @var list<ThreadTokens>
     */
    private array $usage = [];

    public function __construct(private readonly string $processId) {}

    public function read(string $bytes, CarbonImmutable $now): array
    {
        $lines = explode("\n", $this->partial.$bytes);
        $this->partial = (string) array_pop($lines);
        $this->usage = [];

        foreach ($lines as $line) {
            $this->readLine($line, $now);
        }

        return $this->usage;
    }

    public function conversation(): string|null
    {
        return $this->thread;
    }

    public function end(int|null $exitCode, string|null $problem = null): TurnEnd
    {
        return new TurnEnd(exitCode: $exitCode, codexStatus: $this->status, problem: $problem);
    }

    /**
     * One --json event of Codex's own output; a line that is no event of it is passed over.
     */
    #[DecodesAnyJson]
    private function readLine(string $line, CarbonImmutable $now): void
    {
        $this->lines++;
        $decoded = json_decode($line, true);

        if (! is_array($decoded)) {
            return;
        }

        match ($decoded['type'] ?? null) {
            'thread.started' => $this->readThread($decoded['thread_id'] ?? null),
            'turn.completed' => $this->readCompleted($decoded['usage'] ?? null, $now),
            'turn.failed' => $this->status = 'failed',
            default => null,
        };
    }

    /**
     * A completed turn and the tokens it used, which count only when every part is a nonnegative whole number. An exec
     * turn reports only its own tokens, so the thread's count is the turn's, as Codex printed it.
     */
    private function readThread(mixed $threadId): void
    {
        if (is_string($threadId)) {
            $this->thread = $threadId;
        }
    }

    private function readCompleted(mixed $usage, CarbonImmutable $now): void
    {
        $this->status = 'completed';
        $parts = ['input_tokens', 'cached_input_tokens', 'output_tokens', 'reasoning_output_tokens'];

        $isCounted = is_array($usage)
            && array_all($parts, fn (string $part) => is_int($usage[$part] ?? null) && $usage[$part] >= 0);

        if (! $isCounted || $this->thread === null) {
            return;
        }

        $turn = $usage['input_tokens'] + $usage['output_tokens'];
        $source = UsageSource::of("{$this->processId}:tokens", $this->lines, $now);

        $this->usage[] = new ThreadTokens(
            $this->thread,
            $turn,
            $usage['input_tokens'],
            $usage['cached_input_tokens'],
            $usage['output_tokens'],
            $usage['reasoning_output_tokens'],
            $turn,
            $source,
        );
    }
}
