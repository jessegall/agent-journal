<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Drivers\RecordPromptTurn\RecordPromptTurnCommand;
use App\Models\Drivers\DriverTurn;
use App\Support\OutsideCommandAllowance;
use Illuminate\Support\Str;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A hook's prompt records its turn inside the command, as the running app requires of every write, once per prompt.
 */
#[TestsCommand(RecordPromptTurnCommand::class)]
final class RecordPromptTurnTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    protected const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    public function test_a_prompt_records_its_turn_once_with_writes_outside_a_command_refused(): void
    {
        [, $opened] = $this->openRuntime();
        $this->app->make(OutsideCommandAllowance::class)->forbid();

        $this->journal->asSystem(new RecordPromptTurnCommand($opened->sessionId, 3, 'prompt-1'));
        $this->journal->asSystem(new RecordPromptTurnCommand($opened->sessionId, 3, 'prompt-1'));

        $turns = DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->get();
        $this->assertSame([3], $turns->pluck('process_generation')->all());
        $this->assertSame(['prompt-1'], $turns->pluck('native_prompt_id')->all());
    }

    public function test_a_prompt_without_a_generation_takes_the_runtimes_own(): void
    {
        [, $opened] = $this->openRuntime();

        $this->journal->asSystem(new RecordPromptTurnCommand($opened->sessionId, null, 'prompt-1'));

        $this->assertSame(
            [1],
            DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->pluck('process_generation')->all(),
        );
    }

    public function test_a_session_without_a_runtime_records_no_turn(): void
    {
        $this->journal->asSystem(new RecordPromptTurnCommand((string) Str::ulid(), 1, 'prompt-1'));

        $this->assertSame(0, DriverTurn::query()->count());
    }
}
