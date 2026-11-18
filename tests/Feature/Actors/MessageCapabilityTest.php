<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
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
        $this->assertInstanceOf(SendsMessages::class, new Agent());
        $this->assertInstanceOf(ReceivesMessages::class, new Agent());
        $this->assertInstanceOf(SendsMessages::class, new User());
        $this->assertInstanceOf(ReceivesMessages::class, new User());
        $this->assertInstanceOf(SendsMessages::class, new SystemActor());
        $this->assertNotInstanceOf(ReceivesMessages::class, new SystemActor());
    }
}
