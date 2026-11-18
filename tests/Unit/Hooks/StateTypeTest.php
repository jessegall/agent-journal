<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypesFrozen;
use App\Hooks\Exceptions\StateTypeUnknown;
use App\Hooks\Stack\RegisteredStateFactory;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\MainAgentReadyState;
use App\Hooks\States\ReadOnlyHelperReadyState;
use App\Hooks\States\Support\StateTypeRegistry;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\States\WorkingOnTaskState;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\InMemoryTaskType;
use Tests\Fixtures\Hooks\TestFailure;

final class StateTypeTest extends TestCase
{
    public function test_a_registered_type_is_found_by_its_key(): void
    {
        $type = new InMemoryTaskType;
        $registry = new StateTypeRegistry;
        $registry->register('tasks.working', $type);

        $this->assertTrue($registry->has('tasks.working'));
        $this->assertSame($type, $registry->get('tasks.working'));
        $this->assertFalse($registry->has('chat.answering'));
    }

    public function test_an_unknown_key_is_an_error(): void
    {
        $this->expectException(StateTypeUnknown::class);

        (new StateTypeRegistry)->get('chat.answering');
    }

    public function test_a_key_registered_twice_is_an_error(): void
    {
        $registry = new StateTypeRegistry;
        $registry->register('tasks.working', new InMemoryTaskType);

        $this->expectException(StateTypeRepeated::class);

        $registry->register('tasks.working', new InMemoryTaskType);
    }

    public function test_nothing_is_registered_after_the_registry_is_frozen(): void
    {
        $registry = new StateTypeRegistry;
        $registry->freeze();

        $this->expectException(StateTypesFrozen::class);

        $registry->register('tasks.working', new InMemoryTaskType);
    }

    public function test_the_types_are_built_once_with_the_roles_and_every_listener_type(): void
    {
        $events = new Dispatcher;
        $buildCount = 0;
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$buildCount) {
            $buildCount++;
            $event->registry->register('tasks.working', new InMemoryTaskType);
        });
        $types = new StateTypes($events);

        $first = $types->registry();
        $second = $types->registry();

        $this->assertSame($first, $second);
        $this->assertSame(1, $buildCount);
        $this->assertTrue($first->has('tasks.working'));
        $this->assertSame(ReadyStateType::MainAgent, $first->get('hooks.main_ready'));
        $this->assertSame(ReadyStateType::ReadOnlyHelper, $first->get('hooks.read_only_helper_ready'));
    }

    public function test_the_built_in_roles_build_their_own_bottom_states(): void
    {
        $registry = (new StateTypes(new Dispatcher))->registry();
        $noSubject = fn (string $key) => new StateReference($key, NoSubject::None);

        $this->assertSame(MainAgentReadyState::class, $registry->get('hooks.main_ready')->stateFor($noSubject('hooks.main_ready'))::class);
        $this->assertSame(ReadOnlyHelperReadyState::class, $registry->get('hooks.read_only_helper_ready')->stateFor($noSubject('hooks.read_only_helper_ready'))::class);
    }

    public function test_a_failed_build_is_not_kept_and_the_next_use_builds_again(): void
    {
        $events = new Dispatcher;
        $attempts = 0;
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$attempts) {
            $attempts++;

            if ($attempts === 1) {
                throw TestFailure::listenerFailed();
            }

            $event->registry->register('tasks.working', new InMemoryTaskType);
        });
        $types = new StateTypes($events);

        try {
            $types->registry();
            $this->fail('The failing build was not reported.');
        } catch (TestFailure) {
            $this->assertSame(1, $attempts);
        }

        $this->assertTrue($types->registry()->has('tasks.working'));
        $this->assertSame(2, $attempts);
    }

    public function test_a_pushed_frame_reads_its_subject_through_the_registered_type(): void
    {
        $tasks = new InMemoryTaskType([42 => TaskWorkState::Active]);
        $events = new Dispatcher;
        $events->listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $event->registry->register('tasks.working', $tasks));
        $factory = new RegisteredStateFactory(new StateTypes($events));
        $reference = new StateReference('tasks.working', new SubjectReference(42, 1));

        $first = $factory->frameFor($reference);
        $second = $factory->frameFor($reference);

        $this->assertInstanceOf(WorkingOnTaskState::class, $first->state);
        $this->assertFalse($first->isFinished());
        $this->assertNotSame($first->id, $second->id);
        $this->assertSame(1, $first->schemaVersion);
    }
}
