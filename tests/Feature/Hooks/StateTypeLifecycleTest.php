<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use ReflectionClass;
use ReflectionProperty;
use Tests\Fixtures\Hooks\Lifecycle\Listeners\RegisterNoteState;
use Tests\TestCase;

final class StateTypeLifecycleTest extends TestCase
{
    private mixed $discoveryPathsBefore;

    private string $eventCachePath;

    protected function setUp(): void
    {
        $this->discoveryPathsBefore = $this->discoveryPaths()->getValue();
        $this->eventCachePath = sys_get_temp_dir().'/state-type-lifecycle-events-'.getmypid().'.php';
        $this->useEventCachePath($this->eventCachePath);
        EventServiceProvider::addEventDiscoveryPaths([$this->fixtureListenerFolder()]);

        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->discoveryPaths()->setValue(null, $this->discoveryPathsBefore);
        $this->useEventCachePath(null);

        if (is_file($this->eventCachePath)) {
            unlink($this->eventCachePath);
        }
    }

    public function test_the_types_are_built_once_per_worker_and_the_request_bindings_are_fresh_without_the_event_cache(): void
    {
        $this->assertFalse($this->app->eventsAreCached());

        $this->assertTypesLastAcrossTwoRequests();
    }

    public function test_the_types_are_built_once_per_worker_and_the_request_bindings_are_fresh_with_the_event_cache(): void
    {
        $this->artisan('event:cache')->assertSuccessful();
        $this->assertFileExists($this->eventCachePath);

        $this->discoveryPaths()->setValue(null, $this->discoveryPathsBefore);
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
            new FrameRecord('ready', new StateReference('hooks.main_ready', NoSubject::None), true, 1),
            new FrameRecord('note-1', new StateReference('notes.reading', NoSubject::None), false, 1),
        ]), ReadyStateType::MainAgent);

        $this->assertSame(['ready', 'note-1'], $stack->frameIds());
    }

    private function useEventCachePath(string|null $path): void
    {
        if ($path === null) {
            unset($_SERVER['APP_EVENTS_CACHE'], $_ENV['APP_EVENTS_CACHE']);
            putenv('APP_EVENTS_CACHE');

            return;
        }

        $_SERVER['APP_EVENTS_CACHE'] = $path;
        $_ENV['APP_EVENTS_CACHE'] = $path;
        putenv("APP_EVENTS_CACHE={$path}");
    }

    private function fixtureListenerFolder(): string
    {
        return dirname((string) (new ReflectionClass(RegisterNoteState::class))->getFileName());
    }

    private function discoveryPaths(): ReflectionProperty
    {
        return new ReflectionProperty(EventServiceProvider::class, 'eventDiscoveryPaths');
    }
}
