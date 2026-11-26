<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Support\UserChannel;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Only the signed-in owner joins their own private channel; a guessed id or another account gets nothing.
 */
#[TestsMachinery(UserChannel::class)]
final class UserChannelTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
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
