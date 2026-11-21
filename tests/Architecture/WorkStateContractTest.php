<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\AgentState;
use ReflectionClass;
use Tests\Fixtures\Hooks\WorkStates\GatesToolsOnly;
use Tests\Fixtures\Hooks\WorkStates\SilentWork;
use Tests\TestCase;

/**
 * Every registered work state tells the agent what to do and answers its frame's enter, resume and exit (doc 74,
 * story 54); a passive state that only gates owes neither. Reflection proves the declarations exist; an empty answer
 * is caught by the task and plan frame tests.
 */
final class WorkStateContractTest extends TestCase
{
    /**
     * The lifecycle callbacks a work state declares itself or through a trait.
     */
    private const array CALLBACKS = ['onEnter', 'onResume', 'onExit'];

    public function test_every_registered_work_state_instructs_and_answers_its_lifecycle(): void
    {
        $classes = array_map(
            fn (StateLoader $loader) => $loader->stateClass(),
            $this->app->make(StateTypes::class)->registry()->loaders(),
        );

        $this->assertSame([], array_merge(...array_map(self::missingOf(...), array_values($classes))));
    }

    public function test_a_work_state_without_an_instruction_fails_and_a_passive_gate_passes(): void
    {
        $this->assertSame([
            SilentWork::class.' does not implement '.InstructsForeground::class,
            SilentWork::class.' does not declare onEnter',
            SilentWork::class.' does not declare onResume',
            SilentWork::class.' does not declare onExit',
        ], self::missingOf(SilentWork::class));
        $this->assertSame([], self::missingOf(GatesToolsOnly::class));
    }

    /**
     * @param  class-string<AgentState>  $class
     * @return list<string>
     */
    private static function missingOf(string $class): array
    {
        if (! is_a($class, WorkRecordState::class, true)) {
            return [];
        }

        $missing = is_a($class, InstructsForeground::class, true)
            ? []
            : ["{$class} does not implement ".InstructsForeground::class];
        $state = new ReflectionClass($class);

        foreach (self::CALLBACKS as $callback) {
            if ($state->getMethod($callback)->getDeclaringClass()->getName() === AgentState::class) {
                $missing[] = "{$class} does not declare {$callback}";
            }
        }

        return $missing;
    }
}
