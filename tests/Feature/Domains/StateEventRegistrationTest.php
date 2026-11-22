<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Domains\Exceptions\InvalidListener;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Hooks\Delivery\StateEventBridge;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\WritingNoteState;
use Tests\Support\RegistersNoteStates;
use Tests\Support\SetsEventCachePath;
use Tests\TestCase;

final class StateEventRegistrationTest extends TestCase
{
    use RegistersNoteStates;
    use SetsEventCachePath;

    public function test_an_installed_module_registers_one_bridge_alongside_ordinary_listeners(): void
    {
        $provider = $this->providerWithNotes();
        $dispatcher = $this->app->make(Dispatcher::class);
        $received = [];
        $dispatcher->listen(NoteWritten::class, function (NoteWritten $event) use (&$received): void {
            $received[] = $event;
        });

        $provider->boot();
        $event = new NoteWritten();
        $dispatcher->dispatch($event);

        $this->assertSame([$event], $received);
        $this->assertContains(
            StateEventBridge::LISTENER,
            $dispatcher->getRawListeners()[NoteWritten::class],
        );
        $this->assertCount(2, $dispatcher->getRawListeners()[NoteWritten::class]);
    }

    public function test_the_event_cache_keeps_the_owner_and_refuses_stale_metadata(): void
    {
        $provider = $this->providerWithNotes();
        $events = $provider->discoverEvents();
        $expected = implode('|', [
            NoteWritten::class,
            WritingNoteState::class,
            WritingNoteState::class,
            'onNoteWritten',
            'Notes',
        ]);

        $this->assertContains($expected, $events['@state-events']);
        $this->assertCount(4, $events[DomainEventServiceProvider::STATE_EVENTS]);
        $path = (string) tempnam(sys_get_temp_dir(), 'state-event-cache-');
        $this->useEventCachePath($path);
        $this->app->instance('events.cached', true);

        try {
            $this->writeCache($path, $events);
            $provider->boot();
            $dispatcher = $this->app->make(Dispatcher::class);

            $this->assertSame(
                [StateEventBridge::LISTENER],
                $dispatcher->getRawListeners()[NoteWritten::class],
            );

            $events['@state-events'] = array_map(
                fn (string $entry) => $entry === $expected ? str_replace('|Notes', '|Elsewhere', $entry) : $entry,
                $events['@state-events'],
            );
            $this->writeCache($path, $events);

            $this->expectException(InvalidListener::class);
            $this->expectExceptionMessage(InvalidListener::stateCacheChanged()->getMessage());
            $provider->boot();
        } finally {
            $this->useEventCachePath(null);
            unlink($path);
        }
    }

    /**
     * @param  array<string, list<string>>  $events
     */
    private function writeCache(string $path, array $events): void
    {
        $cache = [DomainEventServiceProvider::class => $events];
        file_put_contents($path, '<?php return '.var_export($cache, true).';');
    }
}
