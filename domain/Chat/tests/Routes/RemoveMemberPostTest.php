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
 * The owner removes a member from a group chat they manage, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.remove-member')]
final class RemoveMemberPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_removing_a_member_from_the_members_list_detaches_it_too(): void
    {
        $group = $this->groupWithSam($this->journal);

        $this->assertReachedAndDispatchesItsCommands($this->removesSam(RouteCall::recorded('chat-remove-member', [
            '01JPAGEREQUESTINBOX0000000' => $group,
            '01JPAGEREQUESTMEMBER000000' => $this->journal->userCalled('Sam')->id,
        ]), $group));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $group = $this->groupWithSam($journal);

        return $this->removesSam(RouteCall::recorded('chat-transfer', [
            '01JPAGEREQUESTINBOX0000000' => $group,
            '01JPAGEREQUESTMEMBER000000' => $journal->userCalled('Sam')->id,
        ]), $group);
    }

    /**
     * A group of the owner and Sam; its inbox id.
     */
    private function groupWithSam(TestJournal $journal): string
    {
        $journal->owner()->user('Sam');

        return $journal->run(new OpenInboxCommand(ChatDirectory::GROUP_PROVIDER, (string) Str::ulid(), 'Design', [
            $journal->actorCalled('Owner'),
            $journal->actorCalled('Sam'),
        ]));
    }

    /**
     * The recorded call detaches Sam from the group.
     */
    private function removesSam(RouteCall $call, string $group): RouteCall
    {
        return $call->expects(LeaveInboxCommand::class, [
            'inboxId' => $group,
            'actors' => [$this->journal->actorCalled('Sam')],
        ]);
    }
}
