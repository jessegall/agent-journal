<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Inboxes\Commands\JoinInbox\JoinInboxCommand;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use App\Support\ActorReference;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\ChatDirectory;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner adds a user to a group chat they manage, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.add-member')]
final class AddMemberPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Cy');

        $group = $journal->run(new OpenInboxCommand(ChatDirectory::GROUP_PROVIDER, (string) Str::ulid(), 'Design', [
            $journal->actorCalled('Owner'),
        ]));

        $candidate = $journal->userCalled('Cy');

        return RouteCall::recorded('chat-add-member', [
            '01JPAGEREQUESTINBOX0000000' => $group,
            '01JPAGEREQUESTCANDIDATE000' => $candidate->id,
        ])
            ->expects(JoinInboxCommand::class, [
                'inboxId' => $group,
                'actor' => ActorReference::forUser($candidate->id),
            ]);
    }
}
