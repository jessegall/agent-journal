<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\RecordingMode;

/**
 * A driver exchange as the Go mocks replay it (programs/runner/recording/fixture.go): the opening, every chunk printed
 * between two inputs as one, each input and resize, faked, with offsets in nanoseconds.
 */
final readonly class GoFixture
{
    /**
     * The recording as the Go mocks read it: the opening, every chunk that came out between two inputs as one, each
     * input and resize, with fake values in place of real ones, and offsets in nanoseconds.
     *
     * @param  list<RecordedEvent>  $events
     * @return array<string, mixed>
     */
    public function of(RecordingOpening $opening, array $events, int $exitCode, RecordingFakes $fakes): array
    {
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
                RecordedEventType::Asked, RecordedEventType::Answered => null,
            };
        }

        return [
            'driver' => $opening->wire->value,
            'driver_version' => $opening->image,
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
}
