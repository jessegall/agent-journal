<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Asks\Data\AskInboxPaneData;
use App\Asks\Enums\CoreAskType;
use App\Asks\Values\AskSubject;
use App\Http\Windows\AskInboxWindowBuilder;
use App\Models\Asks\Ask;
use App\Support\ActorReference;
use App\Values\SupervisorTarget;
use App\Values\WorkReference;
use App\Web\Creation\WindowFactory;
use App\Web\Values\PaneExcerpt;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the asks inbox.
 */
#[TestsRoute('GET', 'web.asks')]
final class AsksGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_compact_inbox_exposes_only_previews_and_its_address(): void
    {
        $journal = $this->journal->owner();
        $owner = ActorReference::of($journal->ownerUser());
        $type = CoreAskType::Question;

        foreach (range(1, 6) as $number) {
            $name = "example-{$number}";
            Ask::create(
                Ask::resolveNewReference(),
                $owner,
                $type->key(),
                $name,
                "Can you check this?\nQuestion {$number}",
                new AskSubject($type->subject(), WorkReference::free($name)),
                SupervisorTarget::forActor($owner),
            );
        }

        $factory = new WindowFactory($this->app);
        $factory->register(AskInboxPaneData::class, AskInboxWindowBuilder::class);

        $pane = $factory->create(AskInboxPaneData::class, Request::create('/'));

        $this->assertCount(5, $pane->items);
        $this->assertSame(PaneExcerpt::of("Can you check this?\nQuestion 6"), $pane->items[0]->excerpt);
        $this->assertSame(['id', 'excerpt', 'isOpen'], array_keys($pane->items[0]->toArray()));
        $this->assertSame(route('web.asks', absolute: false), $pane->inboxUrl);
        $this->actingAs($journal->ownerUser())->get(route('web.asks'))->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.status', 'ready')
                ->has('page.data.cards', 6)
                ->has('page.data.cards.0.body')
                ->missing('page.data.items'),
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
