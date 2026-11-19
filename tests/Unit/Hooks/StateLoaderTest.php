<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypesFrozen;
use App\Hooks\Exceptions\StateTypeUnknown;
use App\Hooks\Stack\RegisteredStateFactory;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\ReadyState;
use App\Hooks\States\Support\ReadyStateLoader;
use App\Hooks\States\Support\StateTypeRegistry;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\States\WorkingOnTaskState;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\FixedFileEditPermission;
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
        $types = new StateTypes($events, FixedFileEditPermission::loader());

        $first = $types->registry();
        $second = $types->registry();

        $this->assertSame($first, $second);
        $this->assertSame(1, $buildCount);
        $this->assertTrue($first->has('tasks.working'));
        $this->assertInstanceOf(ReadyStateLoader::class, $first->get(ReadyState::TYPE_KEY));
    }

    public function test_the_ready_type_builds_the_one_bottom_state(): void
    {
        $registry = new StateTypes(new Dispatcher(), FixedFileEditPermission::loader(false))->registry();
        $readyType = $registry->get(ReadyState::TYPE_KEY);
        $ready = new StateReferences([new StateReference(ReadyState::TYPE_KEY, NoSubject::None)]);

        $this->assertSame(ReadyState::class, $readyType->statesFor($ready)->stateAt(0)::class);
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
        $types = new StateTypes($events, FixedFileEditPermission::loader());

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
        $tasks = new InMemoryTaskLoader([42 => TaskWorkState::Active]);
        $events = new Dispatcher();
        $events->listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register('tasks.working', $tasks),
        );
        $factory = new RegisteredStateFactory(
            new StateTypes($events, FixedFileEditPermission::loader()),
            new FixedServerClock(CarbonImmutable::parse('2026-11-18 12:00:00')),
        );
        $reference = new StateReference('tasks.working', new SubjectReference('42', 1));

        $first = $factory->frameFor($reference);
        $second = $factory->frameFor($reference);

        $this->assertInstanceOf(WorkingOnTaskState::class, $first->state);
        $this->assertFalse($first->isFinished());
        $this->assertNotSame($first->id, $second->id);
        $this->assertSame(1, $first->schemaVersion);
    }
}
