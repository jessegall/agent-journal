<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostProcess;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Recordings\TestScenario;
use Tests\Support\Recordings\WireAssert;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Recorded terminal turns run through the person's terminal and the real relay against recorded programs.
 */
#[OverTheWire]
#[TimeLimit(seconds: 240, reason: 'It runs a terminal, relay and served journal through a whole recorded turn.')]
final class RecordedTerminalTurnTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'project_bindings',
        'binding_runtimes',
        'connection_audits',
        'project_invitations',
        'install_attempts',
        'project_environments',
        'projects',
        'settings_records',
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

    private const string COMMAND_PROMPT = 'Run: ls.';

    public function test_a_terminal_session_answers_one_message_and_stops_as_recorded(): void
    {
        $this->journal->owner()
            ->scenario('claude-code/terminal-turn', fn (TestScenario $turn) => $turn
                ->play()
                ->assertHostWire(fn (WireAssert $host) => $host
                    ->ordered(HostInstructionType::Stop, fn (WireAssert $stop) => $stop->count(1)))
                ->assertTyped(self::COMMAND_PROMPT)
                ->assertPlayedWhole());

        $terminal = HostProcess::query()->whereNull('open_instruction_id')->sole();
        $this->journal->assertResult(true, $terminal->started_at !== null);
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
        $codex = $this->journal->service(DriverCatalogue::class)->family(DefaultDrivers::CODEX);

        if (! $codex->isolatesHooksPerSession) {
            $this->markTestSkipped('Connected Codex terminal replay waits on isolated hooks in task 3822.');
        }

        $this->journal->owner()
            ->scenario($scenario, fn (TestScenario $turn) => $turn
                ->play()
                ->assertTyped($keys)
                ->assertTyped(self::COMMAND_PROMPT)
                ->assertPlayedWhole());
    }
}
