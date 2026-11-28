<?php

declare(strict_types=1);

namespace Tests\Reads;

use App\Actors\ActorStore;
use App\Bus\RequestKey;
use App\Events\Web\InboxAccessEnded;
use App\Events\Web\PageChanged;
use App\Events\Web\ProtectedViewInvalidated;
use App\Support\WindowResultBuilder;
use App\Web\Creation\SurfaceDefinition;
use App\Web\LiveProps;
use App\Web\PageProps;
use App\Web\UserChannel;
use Closure;
use Domain\Chat\ChatDomain;
use Domain\Chat\Http\Windows\ChatWindowBuilder;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use LogicException;
use Spatie\LaravelData\Lazy;
use Tests\Fixtures\ClientDeclarations\Library\BooksPaneData;
use Tests\Fixtures\ClientDeclarations\Library\Http\Windows\BooksWindowBuilder;
use Tests\Support\DomainBoot;
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

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_the_agent_section_reads_the_plain_form_request_only_when_its_group_is_loaded(): void
    {
        $journal = $this->journal->owner()->idleAgent('Second agent');
        $agent = $journal->agentCalled('Second agent');
        $section = 'section_web_bar_chat_agent';
        $this->app->bind(
            ChatWindowBuilder::class,
            static fn () => throw new LogicException('The unselected chat pane was resolved.'),
        );

        $this->actingAs($journal->ownerUser())->get(route('home', ['agent' => $agent->id]))->assertInertia(
            fn (AssertableInertia $page) => $page
                ->missing($section)
                ->loadDeferredProps($section, fn (AssertableInertia $group) => $group
                    ->where("{$section}.data.selectedAgentId", $agent->id)
                    ->missing('window_chat_conversation')),
        );
    }

    public function test_home_loads_the_full_chat_content_for_the_requested_column_alone(): void
    {
        $journal = $this->journal->owner()->idleAgent('Selected agent')->idleAgent('Other column');
        $selected = $journal->agentCalled('Selected agent')->id;
        $column = $journal->agentCalled('Other column')->id;
        $prop = 'window_chat_conversation';
        $uri = route('home', ['window' => ['chat.conversation' => ['agent' => $selected, 'read' => $column]]]);

        $this->actingAs($journal->ownerUser())->get($uri)->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.data.windows.0.component', 'chat/HomeChatWindow')
                ->missing($prop)
                ->reloadOnly($prop, fn (AssertableInertia $window) => $window
                    ->where("{$prop}.status", 'ready')
                    ->where("{$prop}.data.selectedAgentId", $selected)
                    ->where("{$prop}.data.conversation.agentId", $column)
                    ->has("{$prop}.data.conversation.entries")
                    ->missing('section_web_bar_chat_agent')
                    ->missing('page')),
        );
    }

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

        $this->assertFalse($live->mark(Lazy::inertia(fn () => 'read')->resolve())->isLive());
        $this->assertFalse($live->mark(Lazy::inertiaDeferred(fn () => 'read', 'sections')->resolve())->isLive());
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
        $results = $this->app->make(WindowResultBuilder::class);
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
