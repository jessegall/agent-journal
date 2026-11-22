<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Enums\ChatPermission;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Support\MessagingTestCase;

/**
 * A signed-in user admitted to chats who is not the owner opens the chat window and nothing else of the journal; the
 * owner keeps every page; a user with no grant is refused everywhere.
 */
final class ChatMemberSignInTest extends MessagingTestCase
{
    private User $bea;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bea = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::create(
            $this->bea,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
    }

    public function test_a_chat_member_opens_the_chat_window_and_is_refused_the_journal_pages(): void
    {
        $this->actingAs($this->bea)->get('/chat')->assertOk();

        foreach (['/tasks', '/plans', '/'] as $page) {
            $this->actingAs($this->bea)->get($page)->assertForbidden();
        }
    }

    public function test_the_owner_keeps_every_page_and_a_user_without_a_grant_gets_none(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $stranger = User::factory()->create(['name' => 'Cy']);

        $this->actingAs($this->owner)->get('/tasks')->assertOk();
        $this->actingAs($stranger)->get('/chat')->assertForbidden();
    }
}
