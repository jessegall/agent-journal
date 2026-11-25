<?php

declare(strict_types=1);

namespace Tests\Commands\Access;

use App\Commands\Access\DisableUser\DisableUserCommand;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner disables a user's account, and with chats on, every chat the user was in ends for them.
 */
final class DisableUserTest extends TestCase
{
    use RefreshHookDatabase;

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_a_disabled_user_leaves_every_inbox(): void
    {
        $this->journal->owner()->user('Guest')->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Guest');
        $guest = $this->journal->userCalled('Guest');

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatOf('Owner', 'Guest');

        $this->journal->run(new DisableUserCommand($guest->id));

        $this->assertNotNull($guest->refresh()->disabled_at);
        $this->assertFalse(InboxMember::isAttached($chat->id, ActorIdentity::of($guest)));
    }
}
