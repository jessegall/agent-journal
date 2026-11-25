<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Navigation\ClientUpdate;
use App\Listeners\BroadcastPageChange;
use App\Support\CatalogueReflectorFactory;
use App\Support\CoreListenerFolders;
use App\Support\DomainRegistry;
use App\Support\ListenerOwnership;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The listener that tells the open pages is typed on the group of facts that change a page, so every event of Core
 * and of the domains that joins the group reaches it, exported or not, with no list of events to keep.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every event folder of the project.')]
final class PageFactListenerTest extends TestCase
{
    public function test_every_event_that_updates_a_page_is_heard_by_the_page_listener(): void
    {
        $listeners = $this->app->make(Dispatcher::class)->getRawListeners();
        $ownership = new ListenerOwnership(
            $this->app->make(DomainRegistry::class),
            CoreListenerFolders::all(),
            new CatalogueReflectorFactory(),
            app_path(),
        );
        $events = $ownership->eventsOf(ClientUpdate::class);
        $unheard = array_values(array_filter(
            $events,
            fn (string $event) => ! self::names($listeners[$event] ?? [], BroadcastPageChange::class),
        ));

        $this->assertNotSame([], $events);
        $this->assertSame([], $unheard);
    }

    /**
     * Whether the wired listeners, in whatever wrapper the dispatcher keeps them, name the listener class.
     */
    private static function names(mixed $listeners, string $class): bool
    {
        return str_contains(stripslashes((string) json_encode($listeners)), $class.'@');
    }
}
