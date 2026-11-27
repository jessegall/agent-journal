<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Exceptions\ProgramLineRefused;
use App\Hosts\Protocol\HostArgumentValues;
use App\Hosts\Protocol\HostProgramLines;

/**
 * Judges a driver's command line by the line host protocol 1 declares for its program: every word and option must be
 * declared, each with the values it takes, and only a prompt may end it. A line of no declared driver is not judged.
 */
final readonly class ProgramLines
{
    /**
     * @param  non-empty-list<string>  $argv  the program first, then its arguments
     *
     * @throws ProgramLineRefused
     */
    public function assertDeclared(array $argv): void
    {
        $executable = basename($argv[0]);

        if (! array_key_exists($executable, HostProgramLines::LINES)) {
            return;
        }

        $line = HostProgramLines::LINES[$executable];
        $arguments = array_slice($argv, 1);
        $index = 0;

        while ($index < count($arguments)) {
            $index = $this->after($line, $arguments, $index);
        }
    }

    /**
     * The index just past the argument at the index and the values it takes.
     *
     * @param  array{
     *     program: string,
     *     words: array<string, HostArgumentValues>,
     *     options: array<string, HostArgumentValues>,
     *     takes_prompt: bool,
     * }  $line
     * @param  list<string>  $arguments
     *
     * @throws ProgramLineRefused
     */
    private function after(array $line, array $arguments, int $index): int
    {
        $argument = $arguments[$index];
        $isOption = str_starts_with($argument, '-');
        $declared = $isOption ? $line['options'] : $line['words'];

        if (array_key_exists($argument, $declared)) {
            return $this->pastValues($line['program'], $arguments, $index, $declared[$argument]);
        }

        $isPrompt = ! $isOption && $line['takes_prompt'] && $index === count($arguments) - 1;

        if ($isPrompt) {
            return $index + 1;
        }

        throw ProgramLineRefused::undeclared($line['program'], $argument);
    }

    /**
     * @param  list<string>  $arguments
     *
     * @throws ProgramLineRefused
     */
    private function pastValues(string $program, array $arguments, int $index, HostArgumentValues $takes): int
    {
        return match ($takes) {
            HostArgumentValues::None => $index + 1,
            HostArgumentValues::One => array_key_exists($index + 1, $arguments)
                ? $index + 2
                : throw ProgramLineRefused::missingValue($program, $arguments[$index]),
            HostArgumentValues::List => $this->pastList($arguments, $index + 1),
        };
    }

    /**
     * The index of the first option from the index on, or the end: a list takes every value up to the next option.
     *
     * @param  list<string>  $arguments
     */
    private function pastList(array $arguments, int $index): int
    {
        $end = $index;

        while (array_key_exists($end, $arguments) && ! str_starts_with($arguments[$end], '-')) {
            $end++;
        }

        return $end;
    }
}
