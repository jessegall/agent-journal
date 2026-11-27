<?php

declare(strict_types=1);

namespace Tests\States;

use App\Access\Contracts\OperationPolicy;
use App\Hooks\Enums\AnswerType;
use App\Sessions\States\ReadyState;
use App\Sessions\States\Support\ReadyStateReference;
use App\Stacks\References\StateReference;
use App\Support\Decisions\Decision;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * The one ready bottom state on the real engine: it answers every hook itself, leaves every shell line to Core's
 * admission, lets a file change only when the agent's policy grants it, never finishes, and keeps the outcomes of the
 * stop attempts it opened in the order it opened them, hearing no attempt of another stack.
 */
#[TestsState(ReadyState::class)]
final class ReadyStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
    }

    public function test_a_profile_that_edits_files_may_edit(): void
    {
        $this->grantFileChanges(true);
        $this->journal->stateOn('Writer', $this->ready(), fn (StateHandle $ready) => $ready->fileEdit(
            'app/Domains/Contracts/Domain.php',
            fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
        ));
    }

    public function test_a_profile_without_file_changes_refuses_the_whole_edit_by_its_first_path(): void
    {
        $this->grantFileChanges(false);
        $this->journal->stateOn('Writer', $this->ready(), fn (StateHandle $ready) => $ready->fileEdit(
            ['app/Domains/Contracts/Domain.php', 'docs/hooks/dependencies.md'],
            fn (StateAssert $state) => $state
                ->answers(AnswerType::Deny)
                ->refuses('app/Domains/Contracts/Domain.php'),
        ));
    }

    public function test_it_never_finishes(): void
    {
        $this->grantFileChanges(true);
        $this->journal->stateOn('Writer', $this->ready(), fn (StateHandle $ready) => $ready
            ->tick(fn (StateAssert $state) => $state->isLive()));
    }

    /**
     * The hooks no driver of a state test sends, such as a session's start and end, a prompt and a compaction, are
     * answered by the state itself.
     */
    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_ready_passes_each_hook_its_policy_grants(string $hook): void
    {
        $input = HookInputs::of($hook);
        $answer = $input->answerBy(new ReadyState(new FixedOperationPolicy(), 'agent', 'session'));

        $this->assertEquals(Decision::delegate(), $answer);
    }

    /**
     * The agent's profile grants file changes, or grants none.
     */
    private function grantFileChanges(bool $editsFiles): void
    {
        $this->app->instance(OperationPolicy::class, new FixedOperationPolicy($editsFiles));
    }

    private function ready(): StateReference
    {
        return ReadyStateReference::forSession($this->journal->sessionOf('Writer')->target);
    }
}
