<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Web\Creation\WindowFactory;
use Domain\Chat\Data\ConversationPaneData;
use Domain\Chat\Http\Windows\ConversationWindowBuilder;
use Illuminate\Http\Request;
use Domain\Chat\ChatDomain;
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
    public function test_the_empty_chat_pane_links_to_the_full_conversation(): void
    {
        $this->journal->owner();
        $windows = new WindowFactory($this->app);
        $windows->register(ConversationPaneData::class, ConversationWindowBuilder::class);
        $pane = $windows->create(ConversationPaneData::class, Request::create('/'));

        $this->assertSame([], $pane->items);
        $this->assertSame(route('chat.conversation', absolute: false), $pane->fullUrl);
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
