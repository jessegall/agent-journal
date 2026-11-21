<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Values\StackTarget;
use App\Hooks\Enums\NoSubject;
use App\Hooks\References\StateReference;
use App\Hooks\Stack\Contracts\StateFactory;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Reflection\Support\ReflectedProperty;
use App\Reflection\Support\Reflector;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Tests\Fixtures\Hooks\Lifecycle\Listeners\RegisterNoteState;
use Tests\Support\SetsEventCachePath;
use Tests\TestCase;

final class StateTypeLifecycleTest extends TestCase
{
    use SetsEventCachePath;

    private mixed $discoveryPathsBefore;

    private string $eventCachePath;

    protected function setUp(): void
    {
        $this->discoveryPathsBefore = $this->discoveryPaths()->readStatic();
        $this->eventCachePath = sys_get_temp_dir().'/state-type-lifecycle-events-'.getmypid().'.php';
        $this->useEventCachePath($this->eventCachePath);
        EventServiceProvider::addEventDiscoveryPaths([$this->fixtureListenerFolder()]);

        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->discoveryPaths()->writeStatic($this->discoveryPathsBefore);
        $this->useEventCachePath(null);

        if (is_file($this->eventCachePath)) {
            unlink($this->eventCachePath);
        }
    }

    public function test_types_build_once_per_worker_and_request_bindings_stay_fresh_without_the_event_cache(): void
    {
        $this->assertFalse($this->app->eventsAreCached());

        $this->assertTypesLastAcrossTwoRequests();
    }

    public function test_types_build_once_per_worker_and_request_bindings_stay_fresh_with_the_event_cache(): void
    {
        $this->artisan('event:cache')->assertSuccessful();
        $this->assertFileExists($this->eventCachePath);

        $this->refreshApplication();

        $this->assertTrue($this->app->eventsAreCached());
        $this->assertTypesLastAcrossTwoRequests();
    }

    private function assertTypesLastAcrossTwoRequests(): void
    {
        $types = $this->app->make(StateTypes::class);
        $registry = $types->registry();
        $firstRestorer = $this->app->make(StackRestorer::class);
        $firstFactory = $this->app->make(StateFactory::class);

        $this->app->forgetScopedInstances();

        $this->assertSame($types, $this->app->make(StateTypes::class));
        $this->assertSame($registry, $this->app->make(StateTypes::class)->registry());
        $this->assertNotSame($firstRestorer, $this->app->make(StackRestorer::class));
        $this->assertNotSame($firstFactory, $this->app->make(StateFactory::class));
        $this->assertTrue($registry->has('notes.reading'));

        $stack = $this->app->make(StackRestorer::class)->restore(new FrameRecords([
            new FrameRecord(
                'ready',
                new StateReference('hooks.ready', NoSubject::None),
                true,
                1,
                CarbonImmutable::now(),
            ),
            new FrameRecord(
                'note-1',
                new StateReference('notes.reading', NoSubject::None),
                false,
                1,
                CarbonImmutable::now(),
            ),
        ]), new StackTarget('agent-1', 'session-1'));

        $this->assertSame(['ready', 'note-1'], $stack->frameIds());
    }

    private function fixtureListenerFolder(): string
    {
        return dirname(Reflector::of(RegisterNoteState::class)->fileName()->getOrElse(''));
    }

    private function discoveryPaths(): ReflectedProperty
    {
        return Reflector::of(EventServiceProvider::class)->property('eventDiscoveryPaths');
    }
}
