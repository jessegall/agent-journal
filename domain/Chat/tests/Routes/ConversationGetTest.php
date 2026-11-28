<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Web\Creation\PageFactory;
use App\Web\Creation\WindowFactory;
use Domain\Chat\ChatDomain;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ChatWindowData;
use Domain\Chat\Http\Windows\ChatWindowBuilder;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the chat page.
 */
#[TestsRoute('GET', 'chat.conversation')]
final class ConversationGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_chat_address_and_home_window_register_distinct_products(): void
    {
        $journal = $this->journal->owner();
        $windows = $this->app->make(WindowFactory::class);
        $pages = $this->app->make(PageFactory::class);

        $this->assertSame(ChatWindowBuilder::class, $windows->builderFor(ChatWindowData::class));
        $this->assertFalse($windows->hasBuilderFor(ChatData::class));
        $this->assertFalse($pages->hasBuilderFor(ChatWindowData::class));

        $window = $windows->create(ChatWindowData::class, Request::create('/'));
        $this->assertSame(ChatWindowData::class, $window::class);
        $this->assertSame([], $window->agents);

        $this->actingAs($journal->ownerUser())->get(route('chat.conversation'))->assertInertia(
            fn (AssertableInertia $page) => $page->component('chat/ChatWindow')
                ->where('page.status', 'ready')
                ->has('page.data.agents')
                ->missing('page.data.items'),
        );
    }

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
