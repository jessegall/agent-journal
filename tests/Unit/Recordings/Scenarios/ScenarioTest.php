<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings\Scenarios;

use App\Agents\Drivers\Enums\DriverType;
use App\Recordings\Scenarios\Enums\ScenarioFact;
use App\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Recordings\Scenarios\Scenario;
use Tests\TestCase;

/**
 * A scenario file is read whole: a good one gives its steps in order; an unknown step or a step lacking a field it
 * needs refuses the whole file before anything runs, naming the step.
 */
final class ScenarioTest extends TestCase
{
    public function test_a_good_file_gives_its_steps_in_order(): void
    {
        $scenario = Scenario::read('claude-code/probe-image-missing', (string) json_encode([
            'description' => 'A Claude Code start whose agent image is missing ends refused, naming the missing image',
            'steps' => [
                ['do' => 'remove-image', 'image' => 'agent'],
                [
                    'do' => 'start-session',
                    'agent' => 'Coder',
                    'type' => 'terminal',
                    'model' => 'claude-haiku-5-5',
                    'effort' => 'low',
                ],
                ['do' => 'wait-for', 'fact' => 'start-refused', 'seconds' => 120],
            ],
        ]));

        $this->assertSame(
            ['claude-code', ScenarioStepType::RemoveImage, DriverType::Terminal, ScenarioFact::StartRefused, 120],
            [
                $scenario->driver(),
                $scenario->steps[0]->stepType,
                $scenario->steps[1]->driverType,
                $scenario->steps[2]->fact,
                $scenario->steps[2]->seconds,
            ],
        );
    }

    public function test_an_unknown_step_refuses_the_whole_file(): void
    {
        $this->expectExceptionObject(ScenarioInvalid::at(
            'codex/turn',
            1,
            'does "dance", which is no step a scenario takes',
        ));

        Scenario::read('codex/turn', '{"steps":[{"do":"stop-daemon"},{"do":"dance"}]}');
    }

    public function test_a_step_lacking_a_field_it_needs_refuses_the_whole_file(): void
    {
        $this->expectExceptionObject(ScenarioInvalid::at('codex/turn', 0, '(send-message) lacks text'));

        Scenario::read('codex/turn', '{"steps":[{"do":"send-message","agent":"Coder"}]}');
    }
}
