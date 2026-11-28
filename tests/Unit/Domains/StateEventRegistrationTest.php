<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Bus\Exceptions\InvalidListener;
use App\Providers\DomainEventServiceProvider;
use App\Support\Delivery\StateEventDelivery;
use App\Support\Domain;
use App\Support\DomainRegistry;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\WriteNoteState;
use Tests\Support\RegistersNoteStates;
use Tests\Support\SetsEventCachePath;
use Tests\TestCase;

final class StateEventRegistrationTest extends TestCase
{
    /**
     * It reads what every installed domain declares, so it boots them all.
     *
     * @return list<class-string<Domain>>
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    use RegistersNoteStates;
    use SetsEventCachePath;

    public function test_the_event_cache_keeps_the_owner_and_refuses_stale_metadata(): void
    {
        $provider = $this->providerWithNotes();
        $events = $provider->discoverEvents();
        $expected = implode('|', [
            NoteWritten::class,
            WriteNoteState::class,
            WriteNoteState::class,
            'onNoteWritten',
            'Notes',
        ]);

        $this->assertContains($expected, $events['@state-events']);
        // Installed domains declare state events of their own; the Notes fixture declares four.
        $this->assertCount(4, array_filter(
            $events[DomainEventServiceProvider::STATE_EVENTS],
            fn (string $entry) => str_ends_with($entry, '|Notes'),
        ));
        $path = (string) tempnam(sys_get_temp_dir(), 'state-event-cache-');
        $this->useEventCachePath($path);
        $this->app->instance('events.cached', true);

        try {
            $this->writeCache($path, $events);
            $provider->boot();
            $dispatcher = $this->app->make(Dispatcher::class);

            $this->assertSame(
                [StateEventDelivery::LISTENER],
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
