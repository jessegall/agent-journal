<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Models\Access\User;
use App\Support\UserChannel;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Only the signed-in owner joins their own private channel; a guessed id or another account gets nothing.
 */
final class UserChannelTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_the_owner_joins_their_own_channel_only(): void
    {
        $channel = $this->app->make(UserChannel::class);

        $this->assertTrue($channel->join($this->journal->ownerUser(), (string) $this->journal->ownerUser()->id));
        $this->assertFalse($channel->join($this->journal->ownerUser(), TestIds::of(99999)));
    }

    public function test_another_account_cannot_join_even_its_own_channel(): void
    {
        $stranger = User::factory()->create();

        $this->assertFalse($this->app->make(UserChannel::class)->join($stranger, (string) $stranger->id));
    }

    public function test_the_channel_sign_in_needs_a_signed_in_user(): void
    {
        $this->journal->asGuest();
        $this->post(
            '/broadcasting/auth',
            ['channel_name' => 'private-'.UserChannel::nameFor($this->journal->ownerUser()->id), 'socket_id' => '1.1'],
        )
            ->assertRedirect('/login');
    }
}
