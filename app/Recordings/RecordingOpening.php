<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Enums\RecordingMode;
use Carbon\CarbonImmutable;
use JsonSerializable;

/**
 * How a recorded exchange opened: the wire and the build it ran on, such as claude-code and 2.1.323, over pipes or in
 * a terminal of a size, the argv, folder and environment it started with, and the moment, in microseconds since the
 * epoch, its events are timed from. Its recording is kept under <wire>/<build> of the recordings.
 */
final readonly class RecordingOpening implements JsonSerializable
{
    /**
     * @param  list<string>  $argv
     * @param  array<string, string>  $environment  each variable it was given, by name
     * @param  list<string>  $inherited  the names of the variables it inherits
     */
    private function __construct(
        public string $wire,
        public string $build,
        public RecordingMode $mode,
        public array $argv,
        public array $environment,
        public string $folder,
        public int $columns,
        public int $rows,
        public array $inherited,
        public int $openedAt,
    ) {}

    /**
     * An exchange that opens now; a terminal's size is given, an exchange over pipes has none.
     *
     * @param  list<string>  $argv
     * @param  list<string>  $environment  each variable as NAME=value
     * @param  list<string>  $inherited
     */
    public static function now(
        string $wire,
        string $build,
        RecordingMode $mode,
        array $argv,
        array $environment,
        string $folder,
        int $columns = 0,
        int $rows = 0,
        array $inherited = [],
    ): self {
        $named = [];

        foreach ($environment as $entry) {
            [$name, $value] = explode('=', $entry, 2) + [1 => ''];
            $named[$name] = $value;
        }

        return new self(
            $wire,
            $build,
            $mode,
            $argv,
            $named,
            $folder,
            $columns,
            $rows,
            $inherited,
            self::microsecondsOf(CarbonImmutable::now()),
        );
    }

    /**
     * @param  array<string, mixed>  $line
     */
    public static function fromLine(array $line): self
    {
        return new self(
            (string) $line['wire'],
            (string) $line['build'],
            RecordingMode::from((string) $line['mode']),
            array_values(array_map(strval(...), (array) $line['argv'])),
            array_map(strval(...), (array) $line['environment']),
            (string) $line['folder'],
            (int) $line['columns'],
            (int) $line['rows'],
            array_values(array_map(strval(...), (array) $line['inherited'])),
            (int) $line['openedAt'],
        );
    }

    /**
     * The moment as the microseconds since the epoch that time a recording's events.
     */
    public static function microsecondsOf(CarbonImmutable $at): int
    {
        return (int) $at->format('Uu');
    }

    public function openedOn(): CarbonImmutable
    {
        return CarbonImmutable::createFromTimestamp($this->openedAt / 1_000_000);
    }

    /**
     * The names of every variable the exchange had, given or inherited, in order.
     *
     * @return list<string>
     */
    public function environmentNames(): array
    {
        $given = array_map(strval(...), array_keys($this->environment));
        $names = array_values(array_unique([...$given, ...$this->inherited]));
        sort($names);

        return $names;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'wire' => $this->wire,
            'build' => $this->build,
            'mode' => $this->mode->value,
            'argv' => $this->argv,
            'environment' => $this->environment,
            'folder' => $this->folder,
            'columns' => $this->columns,
            'rows' => $this->rows,
            'inherited' => $this->inherited,
            'openedAt' => $this->openedAt,
        ];
    }
}
