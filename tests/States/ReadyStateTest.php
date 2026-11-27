<?php

declare(strict_types=1);

namespace Tests\States;

use App\Access\Contracts\OperationPolicy;
use App\Events\Sessions\StopCheckSettled;
use App\Hooks\Enums\AnswerType;
use App\Sessions\Enums\StopCheckStatus;
use App\Stacks\AgentState;
use App\Stacks\Contracts\StopConditionGate;
use App\Stacks\Inputs\Contracts\HookHandler;
use App\Stacks\ReadyState;
use App\Stacks\References\StateReference;
use App\Stacks\Support\ReadyStateReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\CountingStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
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

    /**
     * Every kind of shell line the listed parser reads, including those Core's admission refuses, for a profile that
     * edits files and one that edits none.
     *
     * @return iterable<string, array{bool, string}>
     */
    public static function rolesAndLines(): iterable
    {
        foreach (['a profile that edits files' => true, 'a profile that edits none' => false] as $role => $edits) {
            yield "{$role}, a command alias" => [$edits, 'journal run tests'];

            yield "{$role}, an alias that writes" => [$edits, 'journal run tests --write'];

            yield "{$role}, an ordinary read" => [$edits, 'git status'];

            yield "{$role}, a test run" => [$edits, 'composer test'];

            yield "{$role}, an unparsed line" => [$edits, 'cat <(ls)'];
        }
    }

    #[DataProvider('rolesAndLines')]
    public function test_each_role_leaves_every_shell_line_to_cores_admission(bool $editsFiles, string $line): void
    {
        $this->grantFileChanges($editsFiles);
        $this->journal->stateOn('Writer', $this->ready(), fn (StateHandle $ready) => $ready->shell(
            $line,
            fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
        ));
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

    public function test_unchanged_failures_are_counted_in_the_order_the_attempts_were_opened(): void
    {
        $gate = $this->countingStops();

        $this->grantFileChanges(true);
        $this->journal->stateOn('Writer', $this->ready(), fn (StateHandle $ready) => $ready->steps([
            SessionHook::stop('turn-1'),
            SessionHook::stop('turn-2'),
            SessionHook::stop('turn-3'),
            new StopCheckSettled('stop-turn-3', $this->writerSession(), StopCheckStatus::Failed, 'same'),
            new StopCheckSettled('stop-turn-1', $this->writerSession(), StopCheckStatus::Failed, 'other'),
            new StopCheckSettled('stop-turn-2', $this->writerSession(), StopCheckStatus::Failed, 'same'),
            SessionHook::stop('turn-4'),
        ], fn (StateAssert $state) => $state->isLive()));

        $this->assertSame(2, $gate->lastSettled->unchangedBefore('stop-turn-4', 'same'));
        $this->assertSame(0, $gate->lastSettled->unchangedBefore('stop-turn-4', 'other'));
    }

    public function test_an_attempt_the_stack_did_not_open_is_not_kept(): void
    {
        $gate = $this->countingStops();

        $this->grantFileChanges(true);
        $this->journal->stateOn('Writer', $this->ready(), fn (StateHandle $ready) => $ready->steps([
            SessionHook::stop('turn-1'),
            new StopCheckSettled('elsewhere', $this->writerSession(), StopCheckStatus::Failed, 'same'),
            new StopCheckSettled('stop-turn-1', $this->writerSession(), StopCheckStatus::Failed, 'same'),
            SessionHook::stop('turn-2'),
        ], fn (StateAssert $state) => $state->isLive()));

        $this->assertSame(1, $gate->lastSettled->unchangedBefore('stop-turn-2', 'same'));
    }

    public function test_ready_answers_every_hook_method_of_the_base_state_itself(): void
    {
        $this->assertSame([], $this->hooksNotAnsweredBy(ReadyState::class));
    }

    public function test_a_state_that_skips_a_hook_is_caught_by_the_same_check(): void
    {
        $partial = new class extends AgentState
        {
            public function onStop(StopRequested $input): Decision
            {
                return Decision::delegate();
            }
        };

        $this->assertNotContains('onStop', $this->hooksNotAnsweredBy($partial::class));
        $this->assertContains('onSessionStart', $this->hooksNotAnsweredBy($partial::class));
    }

    /**
     * The hooks no driver of a state test sends, such as a session's start and end, a prompt and a compaction, are
     * answered by the state itself.
     */
    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_ready_passes_each_hook_its_policy_grants(string $hook): void
    {
        $input = HookInputs::of($hook);
        $answer = $input->answerBy(new ReadyState(new FixedOperationPolicy(), new AllowedStops(), 'agent', 'session'));

        $this->assertEquals(Decision::delegate(), $answer);
    }

    /**
     * The agent's profile grants file changes, or grants none.
     */
    private function grantFileChanges(bool $editsFiles): void
    {
        $this->app->instance(OperationPolicy::class, new FixedOperationPolicy($editsFiles));
    }

    /**
     * A stop gate that opens an attempt named after each stop callback and keeps what it was last asked with.
     */
    private function countingStops(): CountingStops
    {
        $gate = new CountingStops();
        $this->app->instance(StopConditionGate::class, $gate);

        return $gate;
    }

    /**
     * The hook methods every state answers, read by reflection, that the class does not declare itself.
     *
     * @param  class-string<AgentState>  $class
     * @return list<string>
     */
    private function hooksNotAnsweredBy(string $class): array
    {
        $hooks = Reflector::of(HookHandler::class)->methods();
        $state = Reflector::of($class);

        return array_values(array_map(
            fn (ReflectedMethod $method) => $method->name(),
            array_filter(
                $hooks,
                fn (ReflectedMethod $method) => $state->method($method->name())->declaringClass()->name() !== $class,
            ),
        ));
    }

    private function ready(): StateReference
    {
        return ReadyStateReference::bottomOf($this->journal->sessionOf('Writer')->target);
    }

    private function writerSession(): string
    {
        return $this->journal->sessionOf('Writer')->id;
    }
}
