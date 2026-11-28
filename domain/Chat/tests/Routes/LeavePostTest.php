<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Inboxes\Commands\LeaveInbox\LeaveInboxCommand;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\ChatDirectory;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A member leaves a group chat, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.leave')]
final class LeavePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Sam');

        $group = $journal->run(new OpenInboxCommand(ChatDirectory::GROUP_PROVIDER, (string) Str::ulid(), 'Design', [
            $journal->actorCalled('Owner'),
            $journal->actorCalled('Sam'),
        ]));

        return RouteCall::recorded('chat-leave', ['01JPAGEREQUESTINBOX0000000' => $group])
            ->expects(LeaveInboxCommand::class, ['inboxId' => $group, 'actors' => [$journal->actorCalled('Owner')]]);
    }
}
