<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
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
 * The owner closes a group chat they manage: every member leaves it, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.close')]
final class ClosePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Sam');

        $group = $journal->run(new OpenInboxCommand(PairChats::GROUP_PROVIDER, (string) Str::ulid(), 'Design', [
            $journal->actorCalled('Owner'),
            $journal->actorCalled('Sam'),
        ]));

        return RouteCall::recorded('chat-close', [
            '01JPAGEREQUESTINBOX0000000' => $group,
        ])
            ->expects(LeaveInboxCommand::class, [
                'inboxId' => $group,
            ])
            ->expects(LeaveInboxCommand::class, [
                'inboxId' => $group,
            ]);
    }
}
