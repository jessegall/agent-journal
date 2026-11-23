<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Contracts\Authorization\OperationPolicy;
use App\Enums\NoSubject;
use App\Events\StateTypesRequested;
use App\Exceptions\StateTypeRepeated;
use App\Exceptions\StateTypesFrozen;
use App\Exceptions\StateTypeUnknown;
use App\Support\Decisions\StateReferences;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\Stack\RegisteredStateFactory;
use App\Support\Stack\StateTypes;
use App\Support\StateCatalog\StateTypeRegistry;
use App\Support\StateLoading\Loaders\ReadyStateLoader;
use App\Support\States\Contracts\StopConditionGate;
use App\Support\States\ReadyState;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\InMemoryTaskLoader;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\FixedServerClock;

final class StateLoaderTest extends TestCase
{
    public function test_a_registered_type_is_found_by_its_key(): void
    {
        $type = new InMemoryTaskLoader();
        $registry = new StateTypeRegistry();
        $registry->register('tasks.working', $type);

        $this->assertTrue($registry->has('tasks.working'));
        $this->assertSame($type, $registry->get('tasks.working'));
        $this->assertFalse($registry->has('communication.answering'));
    }

    public function test_an_unknown_key_is_an_error(): void
    {
        $this->expectException(StateTypeUnknown::class);

        new StateTypeRegistry()->get('communication.answering');
    }

    public function test_a_key_registered_twice_is_an_error(): void
    {
        $registry = new StateTypeRegistry();
        $registry->register('tasks.working', new InMemoryTaskLoader());

        $this->expectException(StateTypeRepeated::class);

        $registry->register('tasks.working', new InMemoryTaskLoader());
    }

    public function test_nothing_is_registered_after_the_registry_is_frozen(): void
    {
        $registry = new StateTypeRegistry();
        $registry->freeze();

        $this->expectException(StateTypesFrozen::class);

        $registry->register('tasks.working', new InMemoryTaskLoader());
    }

    public function test_the_types_are_built_once_with_the_roles_and_every_listener_type(): void
    {
        $events = new Dispatcher();
        $buildCount = 0;
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$buildCount) {
            $buildCount++;
            $event->registry->register('tasks.working', new InMemoryTaskLoader());
        });
        $types = new StateTypes($events, FixedOperationPolicy::loader());

        $first = $types->registry();
        $second = $types->registry();

        $this->assertSame($first, $second);
        $this->assertSame(1, $buildCount);
        $this->assertTrue($first->has('tasks.working'));
        $this->assertInstanceOf(ReadyStateLoader::class, $first->get(ReadyState::TYPE_KEY));
    }

    public function test_the_ready_type_builds_the_one_bottom_state(): void
    {
        $registry = new StateTypes(new Dispatcher(), FixedOperationPolicy::loader(false))->registry();
        $readyType = $registry->get(ReadyState::TYPE_KEY);
        $ready = new StateReferences([new StateReference(ReadyState::TYPE_KEY, NoSubject::None)]);

        $this->assertSame(ReadyState::class, $readyType->statesFor($ready)->stateAt(0)::class);
    }

    // Found on the local journal (23 Nov): under the long-running app server the loader lives across requests. It had
    // kept the container it was built with, so every later tool call was judged by a request that was over, with no
    // actor, and each file read was refused. Each request's state takes its policy from that request's container.
    public function test_the_ready_state_of_each_request_is_built_from_that_requests_own_container(): void
    {
        $asked = [];
        $containerOf = function (string $request) use (&$asked): Container {
            $container = new Container();
            $container->bind(OperationPolicy::class, function () use (&$asked, $request): OperationPolicy {
                $asked[] = $request;

                return new FixedOperationPolicy();
            });
            $container->instance(StopConditionGate::class, new AllowedStops());

            return $container;
        };
        $inHand = $containerOf('first');
        $loader = new ReadyStateLoader(function () use (&$inHand): Container {
            return $inHand;
        });
        $ready = new StateReferences([new StateReference(ReadyState::TYPE_KEY, NoSubject::None)]);

        $loader->statesFor($ready)->stateAt(0);
        $inHand = $containerOf('second');
        $loader->statesFor($ready)->stateAt(0);

        $this->assertSame(['first', 'second'], $asked);
    }

    public function test_a_failed_build_is_not_kept_and_the_next_use_builds_again(): void
    {
        $events = new Dispatcher();
        $attempts = 0;
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$attempts) {
            $attempts++;

            if ($attempts === 1) {
                throw TestFailure::listenerFailed();
            }

            $event->registry->register('tasks.working', new InMemoryTaskLoader());
        });
        $types = new StateTypes($events, FixedOperationPolicy::loader());

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
        $tasks = new InMemoryTaskLoader([42 => TaskState::Started]);
        $events = new Dispatcher();
        $events->listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register('tasks.working', $tasks),
        );
        $factory = new RegisteredStateFactory(
            new StateTypes($events, FixedOperationPolicy::loader()),
            new FixedServerClock(CarbonImmutable::parse('2026-11-18 12:00:00')),
        );
        $reference = new StateReference('tasks.working', new SubjectReference('42', 1));

        $first = $factory->frameFor($reference, new StackTarget('agent-1', 'session-1'));
        $second = $factory->frameFor($reference, new StackTarget('agent-1', 'session-1'));

        $this->assertInstanceOf(WorkingOnTaskState::class, $first->state);
        $this->assertFalse($first->isFinished());
        $this->assertNotSame($first->id, $second->id);
        $this->assertSame(1, $first->schemaVersion);
    }
}
