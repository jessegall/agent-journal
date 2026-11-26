<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Contracts\Hosts\HostChannel;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Illuminate\Support\Str;
use PHPUnit\Framework\Assert;
use Tests\Support\FakeMonotonicClock;

/**
 * A host that plays one committed recording on a fake clock: it shows the recorded frames as the clock passes their
 * offsets, answers each order as a host would, and keeps every byte a driver types, which each checkpoint compares
 * with the bytes the recording's user typed up to it, however the driver split them into writes.
 */
final class StandInHost implements HostChannel
{
    private const string FRAMES = 'frames.json';

    private const string FIXTURE = 'fixture.json';

    private string $typed = '';

    /**
     * @var array<string, array{status: string, refusal?: string, facts: array<string, mixed>}>
     */
    private array $answers = [];

    /**
     * @param  list<array{offset: int, frame: array{rows: list<string>}}>  $frames
     * @param  list<string>  $inputs  the bytes of each recorded input, in order
     * @param  list<int>  $inputOffsets  the offset of each recorded input, in nanoseconds
     */
    private function __construct(
        private readonly array $frames,
        private readonly array $inputs,
        private readonly array $inputOffsets,
        public readonly FakeMonotonicClock $clock,
    ) {}

    public static function playing(string $recordingFolder): self
    {
        $fixture = json_decode((string) file_get_contents($recordingFolder.'/'.self::FIXTURE), true, flags: JSON_THROW_ON_ERROR);
        $frames = json_decode((string) file_get_contents($recordingFolder.'/'.self::FRAMES), true, flags: JSON_THROW_ON_ERROR);
        $inputs = array_values(array_filter($fixture['inputs'] ?? [], fn (array $input) => ! $input['secret']));

        return new self(
            $frames,
            array_map(fn (array $input) => (string) base64_decode($input['bytes'] ?? '', true), $inputs),
            array_map(fn (array $input) => (int) $input['offset'], $inputs),
            new FakeMonotonicClock(),
        );
    }

    /**
     * The recorded inputs, in order, as a driver that types what the user typed sends them.
     *
     * @return list<string>
     */
    public function recordedInputs(): array
    {
        return $this->inputs;
    }

    /**
     * Moves the clock to where the recording's user typed the input of that number.
     */
    public function advanceToInput(int $input): void
    {
        $this->clock->set($this->inputOffsets[$input]);
    }

    /**
     * The rows shown now: those of the last frame whose offset the clock passed.
     *
     * @return list<string>
     */
    public function rows(): array
    {
        $shown = [];

        foreach ($this->frames as $frame) {
            if ($frame['offset'] > $this->clock->nanoseconds()) {
                break;
            }

            $shown = $frame['frame']['rows'];
        }

        return $shown;
    }

    public function guardFor(int $from, int $to): RowGuard
    {
        return new RowGuard($from, $to, $this->hashOf($from, $to));
    }

    /**
     * Fails naming the checkpoint when what the driver typed so far is not what the user typed up to that input.
     */
    public function assertTypedThrough(int $input): void
    {
        $expected = implode('', array_slice($this->inputs, 0, $input + 1));

        Assert::assertSame(
            bin2hex($expected),
            bin2hex($this->typed),
            "At checkpoint {$input} the driver typed other bytes than the recording's user.",
        );
    }

    /**
     * @return array{status: string, refusal?: string, facts: array<string, mixed>}
     */
    public function answerOf(string $orderId): array
    {
        return $this->answers[$orderId];
    }

    public function keys(
        string $processId,
        string $bytes,
        RowGuard $rows,
        int $inputGeneration,
        HostOrderSource $source,
    ): string {
        $hash = $this->hashOf($rows->from, $rows->to);

        if ($hash !== $rows->hash) {
            return $this->answer(['status' => 'refused', 'refusal' => 'guard_moved', 'facts' => ['row_hash' => $hash]]);
        }

        $this->typed .= $bytes;

        return $this->answer(['status' => 'done', 'facts' => []]);
    }

    public function write(string $processId, string $bytes, HostOrderSource $source): string
    {
        $this->typed .= $bytes;

        return $this->answer(['status' => 'done', 'facts' => []]);
    }

    public function resize(string $processId, int $columns, int $rows, HostOrderSource $source): string
    {
        return $this->answer(['status' => 'done', 'facts' => []]);
    }

    public function signal(string $processId, string $signal, HostOrderSource $source): string
    {
        return $this->answer(['status' => 'done', 'facts' => []]);
    }

    public function stop(string $processId, int $graceMs, int $forceMs, HostOrderSource $source): string
    {
        return $this->answer(['status' => 'done', 'facts' => []]);
    }

    public function stream(string $processId, int $framesPerSecond, bool $isRaw, HostOrderSource $source): string
    {
        return $this->answer(['status' => 'done', 'facts' => []]);
    }

    public function snapshot(string $processId, HostOrderSource $source): string
    {
        return $this->answer(['status' => 'done', 'facts' => ['rows' => $this->rows()]]);
    }

    private function hashOf(int $from, int $to): string
    {
        return hash('sha256', implode("\n", array_slice($this->rows(), $from, $to - $from + 1)));
    }

    /**
     * @param  array{status: string, refusal?: string, facts: array<string, mixed>}  $answer
     */
    private function answer(array $answer): string
    {
        $id = (string) Str::ulid();
        $this->answers[$id] = $answer;

        return $id;
    }
}
