<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Contracts\Event;
use App\Hooks\Attributes\StackWide;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Exceptions\InvalidStateClass;
use App\Hooks\Exceptions\InvalidStateMethod;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Domain\Tasks\Events\TaskStarted;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use stdClass;

final class StateMethodsTest extends TestCase
{
    public function test_loader_metadata_requires_a_concrete_state_class(): void
    {
        $this->expectException(InvalidStateClass::class);

        new StateMethods()->forState(stdClass::class);
    }

    #[DataProvider('invalidMethods')]
    public function test_invalid_state_declarations_name_the_method_and_cause(AgentState $state, string $message): void
    {
        $this->expectException(InvalidStateMethod::class);
        $this->expectExceptionMessage($message);

        new StateMethods()->forState($state::class);
    }

    /**
     * @return iterable<string, array{AgentState, string}>
     */
    public static function invalidMethods(): iterable
    {
        yield 'event name' => [new class extends AgentState
        {
            public function onTaskStart(TaskStarted $event): EventCommands
            {
                return EventCommands::none();
            }
        }, '::onTaskStart must be named onTaskStarted.'];

        yield 'non-concrete parameter' => [new class extends AgentState
        {
            public function onTaskStarted(Event $event): EventCommands
            {
                return EventCommands::none();
            }
        }, '::onTaskStarted must be a public instance method with one required concrete Event.'];

        yield 'static method' => [new class extends AgentState
        {
            public static function onTaskStarted(TaskStarted $event): EventCommands
            {
                return EventCommands::none();
            }
        }, '::onTaskStarted must be a public instance method with one required concrete Event.'];

        yield 'invalid return' => [new class extends AgentState
        {
            public function onTaskStarted(TaskStarted $event): void {}
        }, '::onTaskStarted must return '.EventCommands::class.'.'];

        yield 'wrong marker location' => [new class extends AgentState
        {
            #[StackWide]
            public function onTick(StopRequested $input): void {}
        }, '::onTick may use StackWide only on a hook override or state event method.'];

        yield 'marker arguments' => [new class extends AgentState
        {
            #[StackWide(true)]
            public function onTaskStarted(TaskStarted $event): EventCommands
            {
                return EventCommands::none();
            }
        }, '::onTaskStarted may use StackWide once and with no arguments.'];
    }
}
