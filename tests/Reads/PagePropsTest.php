<?php

declare(strict_types=1);

namespace Tests\Reads;

use App\Events\Web\InboxAccessEnded;
use App\Events\Web\PageChanged;
use App\Events\Web\ProtectedViewInvalidated;
use App\Support\UserChannel;
use App\Support\Web\LiveProps;
use App\Support\Web\PageProps;
use Closure;
use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The props of a declared page are live on the viewer's own journal.user channel for the events that change a page;
 * a guest's props listen to nothing, and the inspector reads only while a record is open.
 */
#[TestsRead(PageProps::class)]
final class PagePropsTest extends TestCase
{
    use RefreshHookDatabase;

    private const array EVENTS = [PageChanged::NAME, InboxAccessEnded::NAME, ProtectedViewInvalidated::NAME];

    public function test_every_on_screen_prop_listens_on_the_viewers_channel_for_the_page_events(): void
    {
        $this->journal->owner();
        $channel = UserChannel::nameFor((string) $this->journal->ownerUser()->id);

        $this->actingAs($this->journal->ownerUser())->get(route('home'))->assertInertia(
            function (AssertableInertia $page) use ($channel): void {
                $live = $page->toArray()['liveProps'];

                $this->assertArrayHasKey('page', $live);
                $this->assertArrayHasKey('inspector', $live);
                $windows = array_filter(array_keys($live), fn (string $prop) => str_starts_with($prop, 'window_'));

                $this->assertNotEmpty($windows);

                foreach ($live as $prop) {
                    $this->assertSame(
                        [['channel' => ['name' => $channel, 'type' => 'private'], 'events' => self::EVENTS]],
                        $prop['listeners'],
                    );
                }
            },
        );
    }

    public function test_a_guests_props_listen_to_nothing(): void
    {
        $this->journal->asGuest();
        $live = $this->app->make(LiveProps::class);

        $this->assertFalse($live->optional(fn () => 'read')->isLive());
        $this->assertFalse($live->deferred(fn () => 'read', 'sections')->isLive());
        $this->assertInstanceOf(Closure::class, $live->value(fn () => 'read'));
    }

    public function test_the_inspector_reads_nothing_while_no_record_is_open(): void
    {
        $this->journal->owner();

        $this->actingAs($this->journal->ownerUser())->get(route('home'))->assertInertia(
            fn (AssertableInertia $page) => $page->reloadOnly(
                'inspector',
                fn (AssertableInertia $reload) => $reload->where('inspector', null),
            ),
        );
    }
}
