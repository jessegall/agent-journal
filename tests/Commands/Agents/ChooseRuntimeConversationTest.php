<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChooseRuntimeConversation\ChooseRuntimeConversationCommand;
use App\Models\Agents\AgentRuntime;
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

    public function test_the_named_conversation_is_the_one_the_runtime_continues(): void
    {
        $this->journal->owner()->chooseActiveAccounts(config('accounts.root'))->showDriverArrangements()->idleAgent('Coder')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openCodexRuntimeOn('Coder', 'Mac', base_path(), 'Run: ls.');

        $this->journal->asSystem(new ChooseRuntimeConversationCommand($opened->runtimeId, self::THREAD));

        $this->journal->assertResult(self::THREAD, AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->conversation_id);
    }
}
