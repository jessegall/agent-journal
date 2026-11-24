<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Contracts\Events\Event;
use App\Declarations\StateMethods;
use App\Exceptions\InvalidStateMethod;
use App\Support\Decisions\Decision;
use App\Support\References\StateReference;
use App\Support\States\AgentState;
use App\Support\States\Exceptions\InvalidStateClass;
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
        }, '::onTaskStarted must be a public instance method with one required Event.'];

        yield 'static method' => [new class extends AgentState
        {
            public static function onTaskStarted(TaskStarted $event): null
            {
                return null;
            }
        }, '::onTaskStarted must be a public instance method with one required Event.'];

        yield 'nullable answer' => [new class extends AgentState
        {
            public function onTaskStarted(TaskStarted $event): Decision|null
            {
                return null;
            }
        }, '::onTaskStarted must return void or what a hook returns'];

        yield 'array answer' => [new class extends AgentState
        {
            /**
             * @return list<Decision>
             */
            public function onTaskStarted(TaskStarted $event): array
            {
                return [Decision::delegate()];
            }
        }, '::onTaskStarted must return void or what a hook returns'];
    }

    public function test_an_event_method_may_answer_with_a_command_or_a_delegate_decision(): void
    {
        $state = new class extends AgentState
        {
            public function onTaskStarted(TaskStarted $event): UnlinkRecordsCommand|Decision
            {
                return Decision::delegate();
            }
        };

        $this->assertArrayHasKey(TaskStarted::class, new StateMethods()->eventsOf($state::class));
    }

    public function test_an_event_method_may_answer_with_a_state_to_push(): void
    {
        $state = new class extends AgentState
        {
            public function onTaskStarted(TaskStarted $event): StateReference|Decision
            {
                return Decision::delegate();
            }
        };

        $this->assertArrayHasKey(TaskStarted::class, new StateMethods()->eventsOf($state::class));
    }
}
