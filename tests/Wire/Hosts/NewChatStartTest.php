<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Recordings\TestScenario;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A new chat's whole start as it was recorded on the real local setup: Home's New chat makes a main agent, its first
 * message starts it under the message's key on the played Docker daemon, and it answers. A start the real daemon
 * refused, such as one that mounts a folder the daemon lacks, makes a call the recording does not hold and fails here.
 */
#[OverTheWire]
#[TimeLimit(seconds: 240, reason: 'It runs the real host, a played Docker daemon and a served journal through a start and a turn.')]
final class NewChatStartTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
        'host_driver_images',
        'agents',
        'agent_sessions',
        'agent_start_choices',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'session_requests',
        'inboxes',
        'inbox_members',
        'messages',
        'links',
        'users',
    ];

    public function test_a_new_chats_first_message_starts_its_agent_and_it_answers_as_recorded(): void
    {
        $this->journal->owner()
            ->scenario('claude-code/new-chat', fn (TestScenario $chat) => $chat
                ->play()
                ->assertPlayedWhole());
    }
}
