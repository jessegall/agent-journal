<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\ReflectedProperty;
use App\Support\Stack\StateTypes;
use App\Support\StateLoading\StateValues;
use App\Support\States\AgentState;
use Tests\Fixtures\Hooks\StateLoading\HandedCountState;
use Tests\Fixtures\Hooks\StateLoading\HandedFlagState;
use Tests\Fixtures\Hooks\StateLoading\KeptValuesState;

/**
 * A state keeps its own flags, counts and steps as properties it changes itself: its constructor takes only
 * the subject it is about, which never changes, and the collaborators it works with, never a flag or a value it then
 * changes.
 */
final class StateOwnValuesTest extends TestCase
{
    public function test_no_registered_state_is_handed_a_flag_or_a_value_it_changes(): void
    {
        $handed = [];

        foreach ($this->app->make(StateTypes::class)->registry()->types() as $type) {
            if (! str_starts_with($type->stateClass, 'Tests\\')) {
                $handed = [...$handed, ...self::handedValuesOf($type->stateClass)];
            }
        }

        $this->assertSame([], $handed);
    }

    public function test_a_handed_flag_and_a_handed_count_fail_and_kept_values_pass(): void
    {
        $this->assertSame([HandedFlagState::class.'::$isOpen'], self::handedValuesOf(HandedFlagState::class));
        $this->assertSame([HandedCountState::class.'::$toolUses'], self::handedValuesOf(HandedCountState::class));
        $this->assertSame([], self::handedValuesOf(KeptValuesState::class));
    }

    /**
     * The data the state's constructor is handed that is a flag, or that the state changes after it is made.
     *
     * @param  class-string<AgentState>  $stateClass
     * @return list<string>
     */
    private static function handedValuesOf(string $stateClass): array
    {
        $handed = array_filter(
            StateValues::dataProperties($stateClass),
            fn (ReflectedProperty $property) => $property->isPromoted()
                && (! $property->isReadOnly() || $property->type()->get()->isNamedAs('bool')),
        );

        return array_values(array_map(
            fn (ReflectedProperty $property) => "{$stateClass}::\${$property->name()}",
            $handed,
        ));
    }
}
