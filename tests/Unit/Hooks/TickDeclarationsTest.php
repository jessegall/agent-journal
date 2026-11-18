<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Support\StackTarget;
use App\Hooks\Exceptions\TooManyTickCommands;
use App\Hooks\States\AgentState;
use App\Hooks\States\Support\StateTypeRegistry;
use App\Hooks\Ticks\ElapsedTime;
use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;
use App\Records\Commands\UnlinkRecords;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use LogicException;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ReflectionProperty;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\Ticks\InheritedTickingLoader;
use Tests\Fixtures\Hooks\Ticks\TickingLoader;
use Tests\Support\TestIds;

/**
 * A state type ticks only when its loader carries the TickableStateLoader mark, inherited or not; a tick answers a few
 * ordered commands at most and is told exactly the time, its delta, its entry time and its stack.
 */
final class TickDeclarationsTest extends TestCase
{
    public function test_only_marked_loaders_and_their_subclasses_tick(): void
    {
        $make = fn (): AgentState => throw new LogicException('No state is built here.');
        $registry = new StateTypeRegistry();
        $registry->register('test.ticking', new TickingLoader($make));
        $registry->register('test.inherited', new InheritedTickingLoader($make));
        $registry->register('test.plain', new ClosureStateLoader($make));

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
        $context = new TickContext(CarbonImmutable::now(), ElapsedTime::zero(true), CarbonImmutable::now(), new StackTarget('a', 's'));
        $fields = array_map(fn (ReflectionProperty $property) => $property->getName(), new ReflectionClass($context)->getProperties(ReflectionProperty::IS_PUBLIC));

        $this->assertSame(['now', 'delta', 'enteredAt', 'target'], $fields);
    }

    private function command(int $number): UnlinkRecords
    {
        return new UnlinkRecords(new RecordIdentity('tasks.task', TestIds::of($number)), new RecordIdentity('tasks.task', TestIds::of($number + 100)));
    }
}
