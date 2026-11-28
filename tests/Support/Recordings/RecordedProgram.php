<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Support\Recordings\CutExchange;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\Recordings;
use App\Support\Recordings\ScenarioRecording;
use PHPUnit\Framework\Assert;

final readonly class RecordedProgram
{
    private function __construct(private CutExchange $exchange) {}

    public static function versionOf(Recordings $recordings, string $driver, string $program): string
    {
        return self::from($recordings->scenario($driver, 'first-start'), [$program, '--version'])->printedOn('stdout');
    }

    /**
     * @param  list<string>  $arguments
     */
    public static function from(ScenarioRecording $recording, array $arguments): self
    {
        foreach ($recording->exchangesOn(Wire::Driver) as $name) {
            $exchange = $recording->exchange($name);
            $argv = $exchange->opening->argv;
            $program = array_search($arguments[0], $argv, true);

            if ($program !== false && array_slice($argv, $program, count($arguments)) === $arguments) {
                return new self($exchange);
            }
        }

        Assert::fail('The recording has no program exchange for '.implode(' ', $arguments).'.');
    }

    public function printedOn(string $stream): string
    {
        $printed = '';

        foreach ($this->exchange->events as $event) {
            if ($event->stream === $stream) {
                $printed .= $event->bytes;
            }
        }

        return $printed;
    }

    public function exitCode(): int
    {
        $exitCode = $this->exchange->exitCode;
        Assert::assertNotNull($exitCode, 'The recorded program never exited.');

        return $exitCode;
    }
}
