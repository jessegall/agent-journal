<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Web\Events\UserChannel;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Only the signed-in owner joins their own private channel; a guessed id or another account gets nothing.
 */
final class UserChannelTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_owner_joins_their_own_channel_only(): void
    {
        $channel = $this->app->make(UserChannel::class);

        $this->assertTrue($channel->join($this->owner, (string) $this->owner->id));
        $this->assertFalse($channel->join($this->owner, (string) ($this->owner->id + 1)));
    }

    public function test_another_account_cannot_join_even_its_own_channel(): void
    {
        $stranger = User::factory()->create();

        $this->assertFalse($this->app->make(UserChannel::class)->join($stranger, (string) $stranger->id));
    }

    public function test_the_channel_sign_in_needs_a_signed_in_user(): void
    {
        $this->post('/broadcasting/auth', ['channel_name' => 'private-'.UserChannel::nameFor($this->owner->id), 'socket_id' => '1.1'])
            ->assertRedirect('/login');
    }
}
