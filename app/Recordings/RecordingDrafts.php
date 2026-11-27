<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\RecordingMode;
use App\Values\FilePath;
use Carbon\CarbonImmutable;

/**
 * The one store every wire's recorder writes through, switched on by AGENTS_RECORDING: an exchange's draft gets its
 * opening and each event as it happens, from any container of the journal, and once the exchange ends it is written,
 * with fake values in place of real ones, as the Go mocks replay it (programs/agent/recording/fixture.go), under
 * <wire>/<build>/recorded/<name> of the recordings.
 */
final readonly class RecordingDrafts
{
    /**
     * Where the drafts of the exchanges being recorded are kept, in the project, so every container of the journal
     * adds to the same draft.
     */
    public const string DRAFTS = 'storage/app/recordings';

    public const string RECORDINGS = 'resources/recordings';

    /**
     * The most words of the exchange's arguments a recording's name takes.
     */
    private const int NAME_WORD_LIMIT = 2;

    public function __construct(
        private Files $files,
        private bool $isOn,
        private FilePath $drafts,
        private FilePath $recordings,
    ) {}

    /**
     * The moment an event happens, as the microseconds since the epoch every event is timed by.
     */
    public static function moment(): int
    {
        return RecordingOpening::microsecondsOf(CarbonImmutable::now());
    }

    public function isOn(): bool
    {
        return $this->isOn;
    }

    /**
     * Starts the exchange's draft with its opening, while recording is on.
     */
    public function begin(string $exchangeId, RecordingOpening $opening): void
    {
        if (! $this->isOn) {
            return;
        }

        $this->files->makeFolder($this->drafts, Permissions::Shared);
        $this->files->write($this->draftOf($exchangeId), json_encode($opening, JSON_THROW_ON_ERROR)."\n");
    }

    /**
     * Adds the event to the exchange's draft; an exchange with no draft is not recorded.
     */
    public function add(string $exchangeId, RecordedEvent $event): void
    {
        $draft = $this->draftOf($exchangeId);

        if (! $this->isRecording($draft)) {
            return;
        }

        $this->files->append($draft, json_encode($event, JSON_THROW_ON_ERROR)."\n");
    }

    /**
     * Writes the recording of the exchange that ended, with fake values, and drops its draft.
     */
    public function finish(string $exchangeId, int $exitCode): void
    {
        $draft = $this->draftOf($exchangeId);

        if (! $this->isRecording($draft)) {
            return;
        }

        $lines = array_values(array_filter(explode("\n", $this->files->read($draft))));

        $opening = RecordingOpening::fromLine(
            json_decode((string) array_shift($lines), true, flags: JSON_THROW_ON_ERROR),
        );

        $events = array_map(
            fn (string $line) => RecordedEvent::fromLine(json_decode($line, true, flags: JSON_THROW_ON_ERROR)),
            $lines,
        );

        $folder = "{$opening->wire}/{$opening->build}/recorded/{$this->nameOf($exchangeId, $opening)}";

        $encoded = json_encode(
            $this->fixtureOf($opening, $events, $exitCode),
            JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
        );

        $this->files->write($this->recordings->child("{$folder}/fixture.json"), $encoded."\n");
        $this->files->delete($draft);
    }

    /**
     * The recording as the Go mocks read it: the opening, every chunk that came out between two inputs as one, each
     * input and resize, with fake values in place of real ones, and offsets in nanoseconds.
     *
     * @param  list<RecordedEvent>  $events
     * @return array<string, mixed>
     */
    private function fixtureOf(RecordingOpening $opening, array $events, int $exitCode): array
    {
        $fakes = new RecordingFakes($opening->environment);
        $isTerminal = $opening->mode === RecordingMode::Terminal;
        $output = [];
        $inputs = [];
        $resizes = [];

        foreach (self::joined($events) as $event) {
            $offset = ($event->at - $opening->openedAt) * 1000;

            match ($event->type) {
                RecordedEventType::Printed => $output[] = [
                    'offset' => $offset,
                    'stream' => $event->stream,
                    'bytes' => base64_encode($fakes->replaceIn($event->bytes)),
                ],
                RecordedEventType::Typed => $inputs[] = self::inputOf($event, $offset, $fakes),
                RecordedEventType::Resized => $resizes[] = [
                    'offset' => $offset,
                    'geometry' => [
                        'columns' => $event->columns,
                        'rows' => $event->rows,
                    ],
                ],
            };
        }

        return [
            'driver' => $opening->wire,
            'driver_version' => $opening->build,
            'profile' => '',
            'mode' => $opening->mode->value,
            'geometry' => [
                'columns' => $isTerminal ? $opening->columns : 0,
                'rows' => $isTerminal ? $opening->rows : 0,
            ],
            'recorded_at' => $opening->openedOn()->format('Y-m-d\TH:i:s.uP'),
            'initial_state' => [
                'working_folder' => $fakes->replaceIn($opening->folder),
                'arguments' => array_map($fakes->replaceIn(...), $opening->argv),
                'environment_names' => $opening->environmentNames(),
            ],
            'output' => $output,
            'inputs' => $inputs,
            'resizes' => $resizes,
            'exit_code' => $exitCode,
            'checkpoints' => [],
            'script_parameters' => [],
            'expected_keys' => [],
            'expected_transitions' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function inputOf(RecordedEvent $event, int $offset, RecordingFakes $fakes): array
    {
        if ($event->isSecret) {
            return [
                'offset' => $offset,
                'secret' => true,
                'length' => 0,
            ];
        }

        $typed = $fakes->replaceIn($event->bytes);

        return [
            'offset' => $offset,
            'bytes' => base64_encode($typed),
            'secret' => false,
            'length' => strlen($typed),
        ];
    }

    /**
     * The events with every run of chunks that came out on one stream, with nothing between them, as one chunk, so a
     * value sent in two parts is faked whole.
     *
     * @param  list<RecordedEvent>  $events
     * @return list<RecordedEvent>
     */
    private static function joined(array $events): array
    {
        $joined = [];

        foreach ($events as $event) {
            $last = array_key_last($joined);

            if ($last !== null && $joined[$last]->continues($event)) {
                $joined[$last] = $joined[$last]->followedBy($event);

                continue;
            }

            $joined[] = $event;
        }

        return $joined;
    }

    /**
     * The recording's folder name: when it opened, the first words of its arguments and the exchange.
     */
    private function nameOf(string $exchangeId, RecordingOpening $opening): string
    {
        $words = array_filter(
            array_map(fn (string $argument) => ltrim($argument, '-'), array_slice($opening->argv, 1)),
            fn (string $word) => preg_match('/^[a-z][a-z-]*$/', $word) === 1,
        );

        $opened = $opening->openedOn()->format('Ymd-His');

        return implode('-', [$opened, ...array_slice($words, 0, self::NAME_WORD_LIMIT), substr($exchangeId, 0, 8)]);
    }

    /**
     * Whether recording is on and the exchange of the draft is being recorded.
     */
    private function isRecording(FilePath $draft): bool
    {
        return $this->isOn && $this->files->exists($draft);
    }

    private function draftOf(string $exchangeId): FilePath
    {
        return $this->drafts->child("{$exchangeId}.jsonl");
    }
}
