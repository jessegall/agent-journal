<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Contracts\HostChannel;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Values\HostInstructionSource;
use App\Values\RowGuard;
use Generator;
use Illuminate\Support\Str;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\Hosts\Exceptions\RecordingDiverged;

/**
 * A host that plays one committed recording on a fake clock: it shows the recorded frames as the clock passes their
 * offsets, answers each instruction with the recorded host's answer to one of its type, and keeps every byte a driver types, which each checkpoint compares
 * with the bytes the recording's user typed up to it, however the driver split them into writes.
 */
final class RecordedTerminalHost implements HostChannel
{
    private const string FRAMES = 'frames.json';

    private const string FIXTURE = 'fixture.json';

    private const int NANOSECONDS_PER_MS = 1_000_000;

    /**
     * How long a stream goes on sending the last recorded screen.
     */
    private const int LAST_SCREEN_HELD_MS = 2000;

    private string $typed = '';

    /**
     * @var array<string, array{status: string, refusal?: string, facts: array<string, mixed>}>
     */
    private array $answers = [];

    /**
     * @param  list<array{offset: int, frame: array{rows: list<string>, captured: int, unchanged_ms: list<int>}}>  $frames
     * @param  list<string>  $inputs  the bytes of each recorded input, in order
     * @param  list<int>  $inputOffsets  the offset of each recorded input, in nanoseconds
     */
    private function __construct(
        private readonly array $frames,
        private readonly array $inputs,
        private readonly array $inputOffsets,
        public readonly FakeMonotonicClock $clock,
        private readonly RecordedHostAnswers $recordedAnswers,
    ) {}

    public static function playing(string $recordingFolder, RecordedHostAnswers $answers): self
    {
        $fixture = json_decode(
            (string) file_get_contents($recordingFolder.'/'.self::FIXTURE),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $frames = json_decode(
            (string) file_get_contents($recordingFolder.'/'.self::FRAMES),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $inputs = array_values(array_filter($fixture['inputs'] ?? [], fn (array $input) => ! $input['secret']));

        return new self(
            $frames,
            array_map(fn (array $input) => (string) base64_decode($input['bytes'] ?? '', true), $inputs),
            array_map(fn (array $input) => (int) $input['offset'], $inputs),
            new FakeMonotonicClock(),
            $answers,
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
     * When the recording's user typed the input of that number, in nanoseconds from the recording's start.
     */
    public function inputOffset(int $input): int
    {
        return $this->inputOffsets[$input];
    }

    /**
     * Moves the clock to where the recording's user typed the input of that number.
     */
    public function advanceToInput(int $input): void
    {
        $this->clock->set($this->inputOffsets[$input]);
    }

    /**
     * The rows shown now: those of the frame shown now.
     *
     * @return list<string>
     */
    public function rows(): array
    {
        return $this->shownFrame()['frame']['rows'];
    }

    /**
     * The frame shown now, aged by the clock since it was captured, as the host's stream sends an unchanged screen.
     */
    public function frame(): HostFramePayload
    {
        $shown = $this->shownFrame();
        $agedMs = intdiv(max(0, $this->clock->nanoseconds() - $shown['offset']), self::NANOSECONDS_PER_MS);

        return HostFramePayload::from([
            ...$shown['frame'],
            'captured' => $shown['frame']['captured'] + $agedMs,
            'unchanged_ms' => array_map(fn (int $unchanged) => $unchanged + $agedMs, $shown['frame']['unchanged_ms']),
        ]);
    }

    /**
     * The clock's times from the first recorded frame to a while after the last frame or input, one every interval from
     * the clock's time, as a stream sends frames: a test that moves the clock goes on from there, and the last screen
     * is seen and holds still.
     *
     * @return Generator<int, int>
     */
    public function streamTimes(int $intervalMs): Generator
    {
        $interval = $intervalMs * self::NANOSECONDS_PER_MS;
        $lastFrame = $this->frames[array_key_last($this->frames)]['offset'];
        $last = max($lastFrame, ...$this->inputOffsets) + self::LAST_SCREEN_HELD_MS * self::NANOSECONDS_PER_MS;

        for ($time = $this->frames[0]['offset']; $time <= $last; $time = max($time, $this->clock->nanoseconds()) + $interval) {
            yield $time;
        }
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

        if ($expected !== $this->typed) {
            throw RecordingDiverged::at($input, $expected, $this->typed);
        }
    }

    /**
     * @return array{status: string, refusal?: string, facts: array<string, mixed>}
     */
    public function answerOf(string $instructionId): array
    {
        return $this->answers[$instructionId];
    }

    public function keys(
        string $processId,
        string $bytes,
        RowGuard $rows,
        int $inputGeneration,
        HostInstructionSource $source,
    ): string {
        $hash = $this->hashOf($rows->from, $rows->to);

        if ($hash !== $rows->hash) {
            return $this->answer(['status' => 'refused', 'refusal' => 'guard_moved', 'facts' => ['row_hash' => $hash]]);
        }

        $this->typed .= $bytes;
        $this->advanceToTyped();

        return $this->answer($this->recordedAnswers->to(HostInstructionType::WriteKeys));
    }

    /**
     * Whether the screen after the recorded input, up to the next one, is the screen before it.
     */
    private function isUnchangedBy(int $input): bool
    {
        $next = $this->inputOffsets[$input + 1] ?? PHP_INT_MAX;

        return $this->rowsAt($this->inputOffsets[$input]) === $this->rowsAt($next - 1);
    }

    /**
     * @return list<string>
     */
    private function rowsAt(int $offset): array
    {
        $shown = $this->frames[0];

        foreach ($this->frames as $frame) {
            if ($frame['offset'] > $offset) {
                break;
            }

            $shown = $frame;
        }

        return $shown['frame']['rows'];
    }

    /**
     * Typing what the recording's user typed moves the clock to when the user typed it, never back, so the screen
     * shows what that typing drew however soon it came.
     */
    private function advanceToTyped(): void
    {
        $covered = $this->typedInputs();

        if ($covered > 0) {
            $this->clock->set(max($this->clock->nanoseconds(), $this->inputOffsets[$covered - 1]));
        }
    }

    /**
     * The last frame the clock passed, held at the first recorded input not typed yet, as the recording plays by what
     * is typed: the screen never shows what the recording's user typed before the driver typed it.
     *
     * @return array{offset: int, frame: array<string, mixed>}
     */
    private function shownFrame(): array
    {
        $until = min($this->clock->nanoseconds(), $this->inputOffsets[$this->typedInputs()] ?? PHP_INT_MAX);
        $shown = $this->frames[0];

        foreach ($this->frames as $frame) {
            if ($frame['offset'] > $until) {
                break;
            }

            $shown = $frame;
        }

        return $shown;
    }

    /**
     * How many of the recorded inputs what was typed so far covers, from the first one the typing begins with: a key
     * the recording's user pressed before it drew nothing the driver needed, so it is passed over.
     */
    private function typedInputs(): int
    {
        $first = array_find_key($this->inputs, fn (string $bytes) => str_starts_with($this->typed, $bytes));

        if ($this->typed === '' || $first === null) {
            return 0;
        }

        $recorded = '';
        $covered = $first;

        foreach (array_slice($this->inputs, $first, preserve_keys: true) as $input => $bytes) {
            // A key the user pressed again that drew nothing, such as an arrow past the end of a slider, the driver
            // presses once.
            $isRepeat = $bytes === ($this->inputs[$input - 1] ?? null) && $this->isUnchangedBy($input);

            if (! str_starts_with($this->typed, $recorded.$bytes) && ! $isRepeat) {
                break;
            }

            if (str_starts_with($this->typed, $recorded.$bytes)) {
                $recorded .= $bytes;
            }

            $covered = $input + 1;
        }

        return $covered;
    }

    public function write(string $processId, string $bytes, HostInstructionSource $source): string
    {
        $this->typed .= $bytes;
        $this->advanceToTyped();

        return $this->answer($this->recordedAnswers->to(HostInstructionType::WriteStdin));
    }

    public function resize(string $processId, int $columns, int $rows, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::Resize));
    }

    public function signal(string $processId, string $signal, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::Signal));
    }

    public function stop(string $processId, int $graceMs, int $forceMs, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::Stop));
    }

    public function stream(string $processId, int $framesPerSecond, bool $isRaw, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::Stream));
    }

    public function snapshot(string $processId, HostInstructionSource $source): string
    {
        $recorded = $this->recordedAnswers->to(HostInstructionType::Snapshot);

        return $this->answer([...$recorded, 'facts' => [...$recorded['facts'], 'rows' => $this->rows()]]);
    }

    /**
     * The user's keys are typed as the recording's user typed them, with no guard.
     */
    public function userKeys(string $processId, string $bytes, HostInstructionSource $source): string
    {
        $this->typed .= $bytes;
        $this->advanceToTyped();

        return $this->answer($this->recordedAnswers->to(HostInstructionType::WriteKeys));
    }

    public function openPrivate(string $processId, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::OpenPrivate));
    }

    /**
     * The mock types nothing for a private value: no recording holds one.
     */
    public function writePrivate(string $processId, string $submissionId, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::WritePrivate));
    }

    public function closePrivate(string $processId, HostInstructionSource $source): string
    {
        return $this->answer($this->recordedAnswers->to(HostInstructionType::ClosePrivate));
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
