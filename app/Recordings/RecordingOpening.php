<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\Payloads\HostOpenPlanPayload;
use App\Recordings\Enums\RecordingMode;
use App\Recordings\Enums\Wire;
use Carbon\CarbonImmutable;
use JsonSerializable;

/**
 * How a recorded exchange opened: its wire and name, as calls, pipes or a terminal of a size, the argv, folder,
 * environment and image a program started with, and the moment its events are timed from, in microseconds.
 */
final readonly class RecordingOpening implements JsonSerializable
{
    /**
     * @param  list<string>  $argv
     * @param  array<string, string>  $environment  each variable it was given, by name
     * @param  list<string>  $inherited  the names of the variables it inherits
     */
    private function __construct(
        public Wire $wire,
        public string $exchange,
        public RecordingMode $mode,
        public array $argv,
        public array $environment,
        public array $inherited,
        public string|null $folder,
        public int $columns,
        public int $rows,
        public string|null $image,
        public int $openedAt,
    ) {}

    /**
     * An exchange of calls on the wire that opens now, such as the host's calls of one recording run.
     */
    public static function ofCalls(Wire $wire, string $exchange): self
    {
        return new self($wire, $exchange, RecordingMode::Calls, [], [], [], null, 0, 0, null, self::moment());
    }

    /**
     * A driver program's exchange that opens at the moment, as the plan the host was ordered starts it: in its
     * container's image, a terminal of the plan's size or pipes.
     */
    public static function ofProcess(string $exchange, HostOpenPlanPayload $plan, int $openedAt): self
    {
        $named = [];

        foreach ($plan->environment as $entry) {
            [$name, $value] = explode('=', $entry, 2) + [1 => ''];
            $named[$name] = $value;
        }

        $isTerminal = $plan->type === HostProcessType::Terminal;

        return new self(
            Wire::Driver,
            $exchange,
            $isTerminal ? RecordingMode::Terminal : RecordingMode::Process,
            $plan->argv,
            $named,
            $plan->inherit,
            $plan->folder,
            $isTerminal ? $plan->size->columns : 0,
            $isTerminal ? $plan->size->rows : 0,
            $plan->container?->image,
            $openedAt,
        );
    }

    /**
     * @param  array<string, mixed>  $line
     */
    public static function fromLine(array $line): self
    {
        return new self(
            Wire::from((string) $line['wire']),
            (string) $line['exchange'],
            RecordingMode::from((string) $line['mode']),
            array_values(array_map(strval(...), (array) $line['argv'])),
            array_map(strval(...), (array) $line['environment']),
            array_values(array_map(strval(...), (array) $line['inherited'])),
            $line['folder'] === null ? null : (string) $line['folder'],
            (int) $line['columns'],
            (int) $line['rows'],
            $line['image'] === null ? null : (string) $line['image'],
            (int) $line['openedAt'],
        );
    }

    /**
     * The opening as a recording keeps it: its argv and folder faked, and each variable by its name only, as
     * {env:NAME}, never its value.
     */
    public function fakedBy(RecordingFakes $fakes): self
    {
        $names = array_map(strval(...), array_keys($this->environment));

        return clone ($this, [
            'argv' => array_map($fakes->replaceIn(...), $this->argv),
            'folder' => $this->folder === null ? null : $fakes->replaceIn($this->folder),
            'environment' => array_combine($names, array_map(fn (string $name) => "{env:{$name}}", $names)),
        ]);
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
            'wire' => $this->wire->value,
            'exchange' => $this->exchange,
            'mode' => $this->mode->value,
            'argv' => $this->argv,
            // An object even when empty, so a reader with a map type reads no variables rather than a list.
            'environment' => (object) $this->environment,
            'inherited' => $this->inherited,
            'folder' => $this->folder,
            'columns' => $this->columns,
            'rows' => $this->rows,
            'image' => $this->image,
            'openedAt' => $this->openedAt,
        ];
    }

    private static function moment(): int
    {
        return self::microsecondsOf(CarbonImmutable::now());
    }
}
