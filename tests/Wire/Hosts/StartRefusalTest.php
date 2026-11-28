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
 * A Claude Code start whose agent image the machine no longer holds ends refused, as it was recorded: the journal
 * starts the session on the real host against the played Docker daemon, the host refuses the probe's container, and
 * the start's refusal names the reason the recorded host gave.
 */
#[OverTheWire]
#[TimeLimit(seconds: 240, reason: 'It runs the real host, a played Docker daemon and a served journal through a start.')]
final class StartRefusalTest extends TestCase
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

    public function test_a_start_whose_agent_image_is_missing_ends_refused_as_recorded(): void
    {
        $this->journal->owner()
            ->scenario('claude-code/probe-image-missing', fn (TestScenario $start) => $start
                ->play()
                ->assertRefusedAsRecorded()
                ->assertPlayedWhole());
    }
}
