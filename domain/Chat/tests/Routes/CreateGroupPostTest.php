<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\PairChats;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens a group chat with a title, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.create-group')]
final class CreateGroupPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::recorded('chat-create-group', [])
            ->reply(OpenInboxCommand::class, Str::ulid())
            ->expects(OpenInboxCommand::class, ['providerKey' => PairChats::GROUP_PROVIDER, 'label' => 'Design']);
    }
}
