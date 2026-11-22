<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Contracts\Event;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Exceptions\InvalidStateMethod;
use App\Hooks\States\AgentState;
use App\Hooks\States\Exceptions\InvalidStateClass;
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
            public function onTaskStart(TaskStarted $event): null
            {
                return null;
            }
        }, '::onTaskStart must be named onTaskStarted.'];

        yield 'non-concrete parameter' => [new class extends AgentState
        {
            public function onTaskStarted(Event $event): null
            {
                return null;
            }
        }, '::onTaskStarted must be a public instance method with one required concrete Event.'];

        yield 'static method' => [new class extends AgentState
        {
            public static function onTaskStarted(TaskStarted $event): null
            {
                return null;
            }
        }, '::onTaskStarted must be a public instance method with one required concrete Event.'];
    }
}
