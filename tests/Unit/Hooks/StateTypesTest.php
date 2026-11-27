<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Access\Contracts\OperationPolicy;
use App\Events\Hooks\StateTypesRequested;
use App\Stacks\Contracts\StopConditionGate;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\Exceptions\StateTypeRepeated;
use App\Stacks\Exceptions\StateTypesFrozen;
use App\Stacks\Exceptions\StateTypeUnknown;
use App\Stacks\ReadyState;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Stacks\StateCatalog\StateRegistration;
use App\Stacks\StateFactory;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Stacks\StateTypes;
use App\Stacks\Support\ReadyStateReference;
use App\Support\StateLoading\StateBuilder;
use App\Time\Contracts\ServerClock;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Tasks\TasksDomain;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\DomainBoot;
use Tests\Support\FakeServerClock;
use Tests\TestCase;

/**
 * The state types are registered once per worker under their keys, and every state is built from its values by the
 * container of the request in hand.
 */
final class StateTypesTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_registered_type_is_found_by_its_key(): void
    {
        $type = RegisteredStateType::named('tasks.work', InMemoryTaskState::class);
        $registry = new StateRegistration();
        $registry->register($type);

        $this->assertTrue($registry->has('tasks.work'));
        $this->assertSame($type, $registry->get('tasks.work'));
        $this->assertFalse($registry->has('core.messages.answer'));
    }

    public function test_an_unknown_key_is_an_error(): void
    {
        $this->expectException(StateTypeUnknown::class);

        new StateRegistration()->get('core.messages.answer');
    }

    public function test_a_key_registered_twice_is_an_error(): void
    {
        $registry = new StateRegistration();
        $registry->register(RegisteredStateType::named('tasks.work', InMemoryTaskState::class));

        $this->expectException(StateTypeRepeated::class);

        $registry->register(RegisteredStateType::named('tasks.work', InMemoryTaskState::class));
    }

    public function test_nothing_is_registered_after_the_registry_is_frozen(): void
    {
        $registry = new StateRegistration();
        $registry->freeze();

        $this->expectException(StateTypesFrozen::class);

        $registry->register(RegisteredStateType::named('tasks.work', InMemoryTaskState::class));
    }

    public function test_the_types_are_built_once_with_cores_states_and_every_listener_type(): void
    {
        $events = new Dispatcher();
        $buildCount = 0;
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$buildCount) {
            $buildCount++;
            $event->registry->register(RegisteredStateType::named('tasks.work', InMemoryTaskState::class));
        });
        $types = new StateTypes($events, $this->app);

        $first = $types->registry();
        $second = $types->registry();

        $this->assertSame($first, $second);
        $this->assertSame(1, $buildCount);
        $this->assertTrue($first->has('tasks.work'));
        $this->assertSame(ReadyState::class, $first->get(StateReferenceKeys::of(ReadyStateReference::class))->stateClass);
    }

    // Found on the local journal (23 Nov): under the long-running app server a loader kept the container it was built
    // with, so every later tool call was judged by a request that was over. Each state is made by the container of
    // the request in hand.
    public function test_the_ready_state_of_each_request_is_made_by_that_requests_container(): void
    {
        $asked = [];
        $this->app->instance(StopConditionGate::class, new AllowedStops());
        $policyOf = function (string $request) use (&$asked): Closure {
            return function () use (&$asked, $request): OperationPolicy {
                $asked[] = $request;

                return new FixedOperationPolicy();
            };
        };
        $ready = RegisteredStateType::of(ReadyState::class);

        $this->app->bind(OperationPolicy::class, $policyOf('first'));
        $values = ['agentId' => 'agent', 'sessionId' => 'session'];

        $this->app->make(StateBuilder::class)->build($ready, $values);
        $this->app->bind(OperationPolicy::class, $policyOf('second'));
        $this->app->make(StateBuilder::class)->build($ready, $values);

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

            $event->registry->register(RegisteredStateType::named('tasks.work', InMemoryTaskState::class));
        });
        $types = new StateTypes($events, $this->app);

        try {
            $types->registry();
            $this->fail('The failing build was not reported.');
        } catch (TestFailure) {
            $this->assertSame(1, $attempts);
        }

        $this->assertTrue($types->registry()->has('tasks.work'));
        $this->assertSame(2, $attempts);
    }

    public function test_a_pushed_frame_builds_its_state_from_the_values_its_reference_carries(): void
    {
        $this->app->instance(InMemoryTasks::class, new InMemoryTasks([42]));
        $this->app->instance(ServerClock::class, new FakeServerClock(CarbonImmutable::parse('2026-11-24 12:00:00')));
        $events = new Dispatcher();
        $events->listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                RegisteredStateType::named('tasks.work', InMemoryTaskState::class),
            ),
        );
        $factory = $this->app->make(StateFactory::class, ['types' => new StateTypes($events, $this->app)]);
        $values = ['number' => 42, 'runNumber' => 1];
        $reference = new StateReference('tasks.work', new SubjectReference('42', 1), $values);

        $first = $factory->frameFor($reference);
        $second = $factory->frameFor($reference);

        $this->assertInstanceOf(InMemoryTaskState::class, $first->state);
        $this->assertFalse($first->isFinished());
        $this->assertSame(['number' => 42, 'runNumber' => 1], $first->record()->values);
        $this->assertNotSame($first->id, $second->id);
    }
}
