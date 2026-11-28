<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Stacks\AgentState;
use App\Stacks\StateTypes;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use Tests\Fixtures\StatePublicMethods\DataLeakingState;

/**
 * A state hands out none of its data: its public methods are only its on* hooks, listeners and lifecycle and the
 * methods AgentState or a contract it implements declares; any other public or static method is refused.
 */
final class StatePublicMethodsTest extends TestCase
{
    public function test_no_registered_state_hands_out_its_data(): void
    {
        $faults = [];

        foreach ($this->app->make(StateTypes::class)->registry()->types() as $type) {
            array_push($faults, ...self::faultsOf($type->stateClass));
        }

        $this->assertSame([], array_values(array_unique($faults)));
    }

    public function test_a_public_getter_and_a_static_method_are_named(): void
    {
        $this->assertSame(
            [
                DataLeakingState::class.'::counting is static: a state hands out nothing of its own',
                DataLeakingState::class.'::count is public: a state hands out none of its data',
            ],
            self::faultsOf(DataLeakingState::class),
        );
    }

    /**
     * @param  class-string<AgentState>  $class
     * @return list<string>
     */
    private static function faultsOf(string $class): array
    {
        $state = Reflector::of($class);
        $contract = self::contractOf($state);
        $faults = [];

        foreach ($state->methods() as $method) {
            if (! $method->isPublic() || $method->declaringClass()->name() === AgentState::class) {
                continue;
            }

            $name = $method->name();

            if ($method->isStatic()) {
                $faults[] = "{$class}::{$name} is static: a state hands out nothing of its own";
            }

            if (! $method->isStatic() && ! str_starts_with($name, 'on') && ! in_array($name, $contract, true)) {
                $faults[] = "{$class}::{$name} is public: a state hands out none of its data";
            }
        }

        return $faults;
    }

    /**
     * The methods the stack may call on the state: those AgentState and every interface it implements declare.
     *
     * @param  Reflector<AgentState>  $state
     * @return list<string>
     */
    private static function contractOf(Reflector $state): array
    {
        $declared = [Reflector::of(AgentState::class), ...$state->interfaces()];
        $names = ['__construct'];

        foreach ($declared as $type) {
            array_push($names, ...array_map(fn (ReflectedMethod $method) => $method->name(), $type->methods()));
        }

        return $names;
    }
}
