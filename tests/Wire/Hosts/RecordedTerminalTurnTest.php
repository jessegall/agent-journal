<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Hosts\Protocol\HostInstructionType;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Recordings\TestScenario;
use Tests\Support\Recordings\WireAssert;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Recorded terminal turns play on the real host against recorded programs and Docker calls.
 */
#[OverTheWire]
#[TimeLimit(seconds: 240, reason: 'It runs the real host, a played Docker daemon and a served journal through a whole turn.')]
final class RecordedTerminalTurnTest extends TestCase
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

    public function test_a_terminal_session_answers_one_message_and_stops_as_recorded(): void
    {
        $this->journal->owner()
            ->scenario('claude-code/terminal-turn', fn (TestScenario $turn) => $turn
                ->play()
                ->assertHostWire(fn (WireAssert $host) => $host
                    ->matchesRecording()
                    ->ordered(HostInstructionType::OpenContainer, fn (WireAssert $open) => $open->matchesPayload()))
                ->assertTyped('Run: ls.')
                ->assertPlayedWhole());
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function codexChanges(): iterable
    {
        yield 'model' => ['codex/change-model', '/model gpt-6.1-terra'];

        yield 'effort' => ['codex/change-effort', '/model --reasoning=medium'];
    }

    #[DataProvider('codexChanges')]
    public function test_codex_types_the_recorded_change_and_continues_the_turn(string $scenario, string $keys): void
    {
        $this->journal->owner()
            ->scenario($scenario, fn (TestScenario $turn) => $turn
                ->play()
                ->assertTyped($keys)
                ->assertTyped('Run: ls.')
                ->assertPlayedWhole());
    }
}
