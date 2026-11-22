<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Exceptions\TooManyTickCommands;
use App\Support\ReflectedProperty;
use App\Support\Reflector;
use App\Support\StateCatalog\StateTypeRegistry;
use App\Support\States\AgentState;
use App\Support\Ticks\ElapsedTime;
use App\Support\Ticks\TickCommands;
use App\Support\Ticks\TickContext;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\Ticks\InheritedTickingLoader;
use Tests\Fixtures\Hooks\Ticks\TickingLoader;
use Tests\Fixtures\Hooks\Ticks\TickingState;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\TestActors;

/**
 * A state type ticks only when its loader carries the TickableStateLoader mark, inherited or not; a tick answers a few
 * ordered commands at most and is told exactly the time, its delta, its entry time and its stack.
 */
final class TickDeclarationsTest extends TestCase
{
    public function test_only_marked_loaders_and_their_subclasses_tick(): void
    {
        $make = fn (): AgentState => throw SimulatedFailure::of('No state is built here.');
        $registry = new StateTypeRegistry();
        $registry->register('test.ticking', new TickingLoader($make));
        $registry->register('test.inherited', new InheritedTickingLoader($make));
        $registry->register('test.plain', new ClosureStateLoader(TickingState::class, $make));

        $this->assertSame(['test.ticking', 'test.inherited'], $registry->tickingTypeKeys());
    }

    public function test_a_tick_answers_at_most_ten_commands_in_order(): void
    {
        $commands = array_map(fn (int $number) => $this->command($number), range(1, 10));

        $this->assertSame($commands, TickCommands::of(...$commands)->all());
        $this->assertTrue(TickCommands::none()->isEmpty());
        $this->expectException(TooManyTickCommands::class);
        TickCommands::of(...[...$commands, $this->command(11)]);
    }

    public function test_the_tick_context_has_exactly_four_public_fields(): void
    {
        $context = new TickContext(
            CarbonImmutable::now(),
            ElapsedTime::zero(true),
            CarbonImmutable::now(),
            new StackTarget('a', 's'),
        );
        $fields = array_values(array_map(
            fn (ReflectedProperty $property) => $property->name(),
            array_filter(
                Reflector::of($context)->properties(),
                fn (ReflectedProperty $property) => $property->isPublic(),
            ),
        ));

        $this->assertSame(['now', 'delta', 'enteredAt', 'target'], $fields);
    }

    private function command(int $number): UnlinkRecordsCommand
    {
        return new UnlinkRecordsCommand(
            TestActors::record('tasks.task', $number),
            TestActors::record('tasks.task', $number + 100),
        );
    }
}
