<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Contracts\MessageRecipient;
use App\Actors\Contracts\MessageSender;
use App\Actors\Support\SystemActor;
use App\Agents\Models\Agent;
use Domain\Access\Models\User;
use Tests\TestCase;

/**
 * Which actors may send and receive messages: users and agents both, the system only sends.
 */
final class MessageCapabilityTest extends TestCase
{
    public function test_users_and_agents_send_and_receive_and_the_system_only_sends(): void
    {
        $this->assertInstanceOf(MessageSender::class, new Agent());
        $this->assertInstanceOf(MessageRecipient::class, new Agent());
        $this->assertInstanceOf(MessageSender::class, new User());
        $this->assertInstanceOf(MessageRecipient::class, new User());
        $this->assertInstanceOf(MessageSender::class, new SystemActor());
        $this->assertNotInstanceOf(MessageRecipient::class, new SystemActor());
    }
}
