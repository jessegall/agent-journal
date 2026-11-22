<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hooks\Stack\StateTypes;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\States\AgentState;
use App\Reflection\Support\Reflector;
use Tests\Fixtures\Hooks\WorkStates\GatesToolsOnly;
use Tests\Fixtures\Hooks\WorkStates\SilentWork;
use Tests\TestCase;

/**
 * Every registered state that names a work record also tells the agent what to do with it (doc 74, story 54); a
 * passive state that only gates names neither. Reflection proves the answer is declared; its text is caught by each
 * state's own tests.
 */
final class WorkStateContractTest extends TestCase
{
    public function test_every_registered_work_state_answers_its_instruction(): void
    {
        $classes = array_map(
            fn (StateLoader $loader) => $loader->stateClass(),
            $this->app->make(StateTypes::class)->registry()->loaders(),
        );

        $this->assertSame([], array_values(array_filter(array_values($classes), self::isSilent(...))));
    }

    public function test_a_work_state_without_an_instruction_fails_and_a_passive_gate_passes(): void
    {
        $this->assertTrue(self::isSilent(SilentWork::class));
        $this->assertFalse(self::isSilent(GatesToolsOnly::class));
    }

    /**
     * Whether the state names a work record yet leaves its instruction to the default, which has none.
     *
     * @param  class-string<AgentState>  $class
     */
    private static function isSilent(string $class): bool
    {
        $state = Reflector::of($class);

        return $state->method('workRecordType')->declaringClass()->name() !== AgentState::class
            && $state->method('instruction')->declaringClass()->name() === AgentState::class;
    }
}
