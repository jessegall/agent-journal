<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChooseRuntimeConversation\ChooseRuntimeConversationCommand;
use App\Models\Agents\AgentRuntime;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The conversation a driver named for a runtime becomes the one its later turns continue.
 */
#[TestsCommand(ChooseRuntimeConversationCommand::class)]
final class ChooseRuntimeConversationTest extends TestCase
{
    use RefreshHookDatabase;

    private const string THREAD = 'thread-1';

    public function test_the_conversation_its_driver_named_is_the_one_the_runtime_continues(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts(config('accounts.root'))
            ->showDriverArrangements()
            ->idleAgent('Coder')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Coder', fn (TestAgent $coder) => $coder
            ->openCodexRuntime('Mac', base_path(), 'Run: ls.'));
        $opened = $this->journal->openedRuntimeOf('Coder');

        $before = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->continuesConversation();

        $this->journal->asSystem(new ChooseRuntimeConversationCommand($opened->runtimeId, self::THREAD));

        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $this->journal->assertResult(
            [false, self::THREAD, true],
            [$before, $runtime->conversation_id, $runtime->continuesConversation()],
        );
    }
}
