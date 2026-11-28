<?php

declare(strict_types=1);

namespace Tests\Reads;

use App\Actors\ActorStore;
use App\Bus\RequestKey;
use App\Events\Web\InboxAccessEnded;
use App\Events\Web\PageChanged;
use App\Events\Web\ProtectedViewInvalidated;
use App\Support\WindowResults;
use App\Web\Creation\SurfaceDefinition;
use App\Web\LiveProps;
use App\Web\PageProps;
use App\Web\UserChannel;
use Closure;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\ClientDeclarations\Library\BooksPaneData;
use Tests\Fixtures\ClientDeclarations\Library\Http\Windows\BooksWindowBuilder;
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

        $live = $this->pageObject($this->actingAs($this->journal->ownerUser())->get(route('home')))['liveProps'];

        $this->assertArrayHasKey('page', $live);
        $this->assertArrayNotHasKey('inspector', $live);
        $this->assertEmpty(array_filter(array_keys($live), fn (string $prop) => str_starts_with($prop, 'window_')));

        foreach ($live as $prop) {
            $this->assertSame(
                [['channel' => ['name' => $channel, 'type' => 'private'], 'events' => self::EVENTS]],
                $prop['listeners'],
            );
        }
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

    public function test_a_surface_and_each_copy_have_their_own_receipt_key(): void
    {
        $keys = $this->app->make(RequestKey::class);
        $results = $this->app->make(WindowResults::class);
        $surface = new SurfaceDefinition(BooksPaneData::class, BooksWindowBuilder::class, 'BooksPane.vue');
        $keys->set('one-outer-visit');

        $this->app->make(ActorStore::class)->actAsSystem('fixture', function () use ($keys, $results, $surface): void {
            $seen = [];

            $read = function () use ($keys, &$seen): BooksPaneData {
                $seen[] = $keys->key();

                return BooksPaneData::build()->titles([])->finish();
            };

            $parts = [
                'page library.books',
                'inspector library.books',
                'window library.books~abcdef123456',
                'window library.books~123456abcdef',
            ];

            foreach ($parts as $part) {
                $results->surface('library.books', $part, [], $surface, $read);
            }

            $this->assertCount(4, array_unique($seen));
            $this->assertSame('one-outer-visit', $keys->key());
        });
    }

    /**
     * The page object the response renders, with the live props Inertia lists beside the props; the Inertia assert
     * leaves those out.
     *
     * @return array<string, mixed>
     */
    private function pageObject(TestResponse $response): array
    {
        return json_decode((string) json_encode($response->viewData('page')), true);
    }
}
