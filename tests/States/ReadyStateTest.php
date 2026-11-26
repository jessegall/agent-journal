<?php

declare(strict_types=1);

namespace Tests\States;

use App\Contracts\Authorization\OperationPolicy;
use App\Enums\Engine\NoSubject;
use App\Enums\Hooks\AnswerType;
use App\Enums\Sessions\StopCheckStatus;
use App\Events\Sessions\StopCheckSettled;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookHandler;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use App\Support\References\StateReference;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use App\Support\States\AgentState;
use App\Support\States\Contracts\StopConditionGate;
use App\Support\States\ReadyState;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\CountingStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\ScenarioTick;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
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

    private SessionHooks $hooks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
        $this->hooks = $this->journal->hooksFor($this->journal->sessionOf('Writer'));
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
        $this->ready($editsFiles)->given(
            $this->hooks->shell($line),
            fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
        );
    }

    public function test_a_profile_that_edits_files_may_edit(): void
    {
        $this->ready(true)->given(
            $this->hooks->fileEdit('app/Domains/Contracts/Domain.php'),
            fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
        );
    }

    public function test_a_profile_without_file_changes_refuses_the_whole_edit_by_its_first_path(): void
    {
        $this->ready(false)->given(
            $this->hooks->fileEdit('app/Domains/Contracts/Domain.php', 'docs/hooks/dependencies.md'),
            function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Deny);
                $state->assertRefusedWith('app/Domains/Contracts/Domain.php');
            },
        );
    }

    public function test_it_never_finishes(): void
    {
        $this->ready(true)->given(new ScenarioTick(), fn (StateObservation $state) => $state->assertLive());
    }

    public function test_unchanged_failures_are_counted_in_the_order_the_attempts_were_opened(): void
    {
        $gate = $this->countingStops();

        $this->ready(true)->given([
            $this->hooks->stop('turn-1'),
            $this->hooks->stop('turn-2'),
            $this->hooks->stop('turn-3'),
            new StopCheckSettled('stop-turn-3', StopCheckStatus::Failed, 'same'),
            new StopCheckSettled('stop-turn-1', StopCheckStatus::Failed, 'other'),
            new StopCheckSettled('stop-turn-2', StopCheckStatus::Failed, 'same'),
            $this->hooks->stop('turn-4'),
        ], fn (StateObservation $state) => $state->assertLive());

        $this->assertSame(2, $gate->lastSettled->unchangedBefore('stop-turn-4', 'same'));
        $this->assertSame(0, $gate->lastSettled->unchangedBefore('stop-turn-4', 'other'));
    }

    public function test_an_attempt_the_stack_did_not_open_is_not_kept(): void
    {
        $gate = $this->countingStops();

        $this->ready(true)->given([
            $this->hooks->stop('turn-1'),
            new StopCheckSettled('elsewhere', StopCheckStatus::Failed, 'same'),
            new StopCheckSettled('stop-turn-1', StopCheckStatus::Failed, 'same'),
            $this->hooks->stop('turn-2'),
        ], fn (StateObservation $state) => $state->assertLive());

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
    public function test_ready_passes_each_hook_its_policy_grants(HookInput $input): void
    {
        $answer = $input->answerBy(new ReadyState(new FixedOperationPolicy(), new AllowedStops()));

        $this->assertEquals(Decision::delegate(), $answer);
    }

    /**
     * The bottom frame of the agent's stack, with a policy that grants file changes or grants none.
     */
    private function ready(bool $editsFiles): StateHandle
    {
        $this->app->instance(OperationPolicy::class, new FixedOperationPolicy($editsFiles));

        return $this->journal->stateOn(
            $this->journal->sessionOf('Writer'),
            new StateReference(ReadyState::TYPE_KEY, NoSubject::None),
        );
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
}
