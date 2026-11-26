<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Support\ActorReference;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\PairChats;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner removes a member from a group chat they manage, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.remove-member')]
final class RemoveMemberPostTest extends GuardedRouteEntryTestCase
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

        $member = $journal->userCalled('Sam');

        return RouteCall::recorded('chat-transfer', [
            '01JPAGEREQUESTINBOX0000000' => $group,
            '01JPAGEREQUESTMEMBER000000' => $member->id,
        ])
            ->expects(LeaveInboxCommand::class, [
                'inboxId' => $group,
                'actor' => ActorReference::forUser($member->id),
            ]);
    }
}
