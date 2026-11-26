<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Inboxes\Commands\HandOverInbox\HandOverInboxCommand;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use App\Support\ActorReference;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\PairChats;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner hands a group chat over to another member.
 */
#[TestsRoute('POST', 'chat.transfer')]
final class TransferPostTest extends GuardedRouteEntryTestCase
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

        return RouteCall::as(Caller::User)
            ->payload(['inboxId' => $group, 'participant' => "user:{$member->id}"])
            ->expects(HandOverInboxCommand::class, [
                'inboxId' => $group,
                'from' => $journal->actorCalled('Owner'),
                'to' => ActorReference::forUser($member->id),
            ]);
    }
}
