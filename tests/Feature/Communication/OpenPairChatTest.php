<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Inboxes\InboxResolver;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorContext;
use App\Support\RegisteredInboxes;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Tests\Support\MessagingTestCase;

/**
 * The user's direct chat with an agent opens once and reopens at the same inbox by its pair; another agent gets its
 * own chat, and only the pair's two members are members of it.
 */
final class OpenPairChatTest extends MessagingTestCase
{
    public function test_the_same_pair_reopens_at_one_inbox_and_another_agent_gets_its_own(): void
    {
        $this->asOwner();

        $first = $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id));
        $again = $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id));
        $other = $this->runOnBus(new OpenPairChatCommand($this->reviewer->agent_id));

        $this->assertSame($first, $again);
        $this->assertNotSame($first, $other);

        $inbox = $this->app->make(InboxResolver::class)->resolve($first);
        $access = $this->app->make(RegisteredInboxes::class)->accessFor($inbox);

        $this->assertCount(2, $access->members($inbox)->memberships);
        $this->expectException(InboxUnavailable::class);
        $access->membership($inbox, ActorContext::forAgent($this->reviewer->agent_id));
    }
}
