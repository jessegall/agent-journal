<?php

declare(strict_types=1);

namespace Tests\Commands\Access;

use App\Commands\Access\DisableUser\DisableUserCommand;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Chat\ChatDomain;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * The owner disables a user's account, and with chats on, every chat the user was in ends for them.
 */
final class DisableUserTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_a_disabled_user_leaves_every_inbox(): void
    {
        $this->journal()->owner()->user('Guest')->chat('Owner', 'Guest');
        $guest = $this->journal()->userCalled('Guest');

        $this->journal()->run(new DisableUserCommand($guest->id));

        $this->assertNotNull($guest->refresh()->disabled_at);
        $this->assertFalse(InboxMember::isAttached($this->journal()->chatOf('Owner', 'Guest')->id, ActorIdentity::of($guest)));
    }
}
