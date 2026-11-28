<?php

declare(strict_types=1);

namespace App\Support\Recordings\Scenarios;

use App\Support\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Support\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use Throwable;

/**
 * A scenario: what it records, named driver/name as its file under resources/recordings/scenarios, and its steps in
 * order. A file is read whole and checked before any step runs.
 */
final readonly class Scenario
{
    public const string CONNECTED = 'connected';

    /**
     * @param  list<ScenarioStep>  $steps
     */
    private function __construct(public string $name, public string $description, public array $steps) {}

    /**
     * The scenario its file holds; an unknown step, a field its step needs and lacks, or a value of the wrong shape
     * refuses the whole file, naming the step.
     *
     * @throws ScenarioInvalid
     */
    public static function read(string $name, string $file): self
    {
        try {
            $read = ScenarioFile::from($file);
        } catch (Throwable $unreadable) {
            throw ScenarioInvalid::unreadable($name, $unreadable);
        }

        $steps = $read->steps;

        return new self($name, $read->description, array_map(
            fn (mixed $step, int $index) => self::stepOf($name, $index, (array) $step),
            $steps,
            array_keys($steps),
        ));
    }

    public function usesOwnTerminal(): bool
    {
        return array_any($this->steps, fn (ScenarioStep $step) => $step->startsOwnTerminal());
    }

    public function driver(): string
    {
        return explode('/', $this->name, 2)[0];
    }

    /**
     * The agents the play makes before its first step, each once by its name: every agent a step names, except one a
     * main-agent creation step makes itself.
     *
     * @return list<string>
     */
    public function agentsMadeBeforePlay(): array
    {
        $named = array_filter(array_map(fn (ScenarioStep $step) => $step->agent, $this->steps));

        $created = array_map(
            fn (ScenarioStep $step) => $step->agent,
            array_filter($this->steps, fn (ScenarioStep $step) => $step->stepType === ScenarioStepType::CreateMainAgent),
        );

        return array_values(array_unique(array_diff($named, $created)));
    }

    /**
     * @param  array<string, mixed>  $step
     *
     * @throws ScenarioInvalid
     */
    private static function stepOf(string $name, int $index, array $step): ScenarioStep
    {
        $type = ScenarioStepType::tryFrom((string) ($step['do'] ?? ''));

        if ($type === null) {
            $named = (string) ($step['do'] ?? '');

            throw ScenarioInvalid::at($name, $index, "does \"{$named}\", which is no step a scenario takes");
        }

        $missing = array_values(array_diff($type->requiredFields(), array_keys($step)));

        if ($missing !== []) {
            throw ScenarioInvalid::at($name, $index, "({$type->value}) lacks ".implode(', ', $missing));
        }

        try {
            return ScenarioStep::from($step);
        } catch (Throwable $wrongShape) {
            throw ScenarioInvalid::at($name, $index, "({$type->value}) holds a value of the wrong shape", $wrongShape);
        }
    }
}
