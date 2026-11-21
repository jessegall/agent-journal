<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Values\StackTarget;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\TooManyLifecycleCommands;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\References\StateReference;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use App\Records\Commands\UnlinkRecords;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestActors;

final class LifecycleCommandsTest extends TestCase
{
    public function test_a_state_answers_no_commands_by_default_and_keeps_the_order_it_returns(): void
    {
        $state = new class extends AgentState {};
        $context = new LifecycleContext(
            new StackTarget('agent-1', 'session-1'),
            'frame-1',
            new StateReference('tasks.working', NoSubject::None),
        );
        $commands = array_map($this->command(...), range(1, 10));

        $this->assertTrue($state->onEnter($context)->isEmpty());
        $this->assertTrue($state->onResume($context)->isEmpty());
        $this->assertTrue($state->onExit($context)->isEmpty());
        $this->assertSame($commands, LifecycleCommands::of(...$commands)->commands);
    }

    public function test_a_lifecycle_callback_cannot_return_more_than_ten_commands(): void
    {
        $commands = array_map($this->command(...), range(1, 11));

        $this->expectException(TooManyLifecycleCommands::class);
        LifecycleCommands::of(...$commands);
    }

    private function command(int $number): UnlinkRecords
    {
        return new UnlinkRecords(
            TestActors::record('tasks.task', $number),
            TestActors::record('tasks.task', $number + 100),
        );
    }
}
