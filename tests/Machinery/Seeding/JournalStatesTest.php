<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\Enums\RewriteSupport;
use App\Hooks\Enums\AnswerType;
use App\Models\Agents\AgentSession;
use App\Providers\DomainEventServiceProvider;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Fixtures\Domains\Counting\CountingDomain;
use Tests\Fixtures\Domains\Counting\Events\SubjectSeen;
use Tests\Fixtures\Domains\Counting\States\CountFactsStateReference;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\SubjectIds;
use Tests\Fixtures\Hooks\Ticks\ScriptedOccurrenceGuard;
use Tests\Fixtures\Hooks\Ticks\ScriptedTickState;
use Tests\Fixtures\Hooks\Ticks\TickScript;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RegistersTestStates;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;
use Throwable;

/**
 * A state of a test on an agent's real stack: bound to its one frame, answering hooks as the agent, hearing facts
 * through the dispatcher and ticks through an engine pass, and asserted in its scope after each step.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalStatesTest extends TestCase
{
    use CommitsHookRows;
    use InstallsCommandModules;
    use RegistersTestStates;

    /**
     * Facts reach a stack only once its change commits, so these tests commit and empty what they wrote.
     */
    protected const array TABLES = [
        'agent_stacks',
        'command_receipts',
    ];

    private TickScript $ticks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerTestState('test.tasks', InMemoryTaskState::class);
        $this->registerTestState('test.ticking', ScriptedTickState::class);
        $this->bootModules(CountingDomain::class);
        new DomainEventServiceProvider($this->app)->boot();
        $this->ticks = new TickScript();
        $this->app->instance(TickScript::class, $this->ticks);
        $this->app->instance(ScriptedOccurrenceGuard::class, new ScriptedOccurrenceGuard());
        $this->app->instance(InMemoryTasks::class, new InMemoryTasks([42]));
        $this->journal->owner()->agent('Writer');
    }

    public function test_a_second_frame_of_the_same_reference_is_refused_by_its_type(): void
    {
        $this->journal->pushState('Writer', $this->counting('a', 1));

        $this->journal->pushState('Writer', $this->counting('a', 1))->assertRefused(
            FixtureRefused::class,
            fn () => $this->journal->stateOn('Writer', $this->counting('a', 1), fn () => null),
            fn (FixtureRefused $refused) => $this->assertSame(FixtureRefusalType::NotOneFrame, $refused->type),
        );
    }

    public function test_a_push_the_engine_keeps_on_one_frame_binds_that_frame(): void
    {
        $task = new StateReference('test.tasks', new SubjectReference(SubjectIds::of('42'), 1), [
            'number' => 42,
            'runNumber' => 1,
        ]);

        $this->journal
            ->pushState('Writer', $task)
            ->pushState('Writer', $task)
            ->stateOn('Writer', $task, fn (StateHandle $tasks) => $tasks
                ->steps([], fn (StateAssert $state) => $state->isOnTop()->present($task)));
    }

    public function test_a_hook_is_answered_by_the_state_and_the_prior_actor_comes_back(): void
    {
        $this->journal->actAs('Owner');

        $this->journal
            ->pushState('Writer', $this->counting('a', 1))
            ->stateOn('Writer', $this->counting('a', 1), fn (StateHandle $counting) => $counting
                ->stop(fn (StateAssert $state) => $state->answers(AnswerType::Deny)->stackAnswers(AnswerType::Deny)));

        $this->assertOwnerActs();
    }

    public function test_a_hook_that_fails_still_puts_the_prior_actor_back(): void
    {
        $this->journal->actAs('Owner');
        $silent = new DriverCapabilities('Silent driver', 'no replies', [], RewriteSupport::WithoutApproval);

        $this->assertThrows(
            fn () => $this->journal
                ->pushState('Writer', $this->counting('a', 1))
                ->stateOn('Writer', $this->counting('a', 1), fn (StateHandle $counting) => $counting
                    ->answeredFor($silent)
                    ->stop(fn () => null)),
            Throwable::class,
        );

        $this->assertOwnerActs();
    }

    public function test_a_fact_reaches_the_frame_and_leaves_no_answer_to_read(): void
    {
        $this->journal
            ->pushState('Writer', $this->counting('a', 3))
            ->stateOn('Writer', $this->counting('a', 3), fn (StateHandle $counting) => $counting->event(
                new SubjectSeen('a'),
                function (StateAssert $state) {
                    $state->where('heard', 1)->isLive();
                    $this->assertThrows(
                        fn () => $state->stackAnswers(AnswerType::Deny),
                        fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::NoHookAnswer,
                    );
                },
            ));
    }

    public function test_a_tick_runs_an_engine_pass(): void
    {
        $ticking = new StateReference('test.ticking', new SubjectReference('a', 1), ['subject' => 'a']);

        $this->journal->pushState('Writer', $ticking)->stateOn('Writer', $ticking, fn (StateHandle $state) => $state
            ->tick(fn () => $this->assertCount(1, $this->ticks->ticks['a'] ?? [])));
    }

    public function test_a_list_of_facts_ends_as_the_same_facts_given_one_by_one(): void
    {
        $this->journal
            ->pushState('Writer', $this->counting('a', 3))
            ->stateOn('Writer', $this->counting('a', 3), fn (StateHandle $counting) => $counting->steps(
                [new SubjectSeen('a'), new SubjectSeen('a')],
                fn (StateAssert $state) => $state->where('heard', 2),
            ))
            ->pushState('Writer', $this->counting('b', 3))
            ->stateOn('Writer', $this->counting('b', 3), fn (StateHandle $counting) => $counting
                ->event(new SubjectSeen('b'), fn () => null)
                ->event(new SubjectSeen('b'), fn (StateAssert $state) => $state->where('heard', 2)));
    }

    public function test_a_covered_frame_keeps_its_id_and_resumes_on_top_once_the_cover_finished(): void
    {
        $this->journal
            ->pushState('Writer', $this->counting('under', 1))
            ->pushState('Writer', $this->counting('cover', 1))
            ->stateOn('Writer', $this->counting('under', 1), fn (StateHandle $under) => $under
                ->event(new SubjectSeen('other'), fn (StateAssert $state) => $state->isCovered())
                ->event(new SubjectSeen('cover'), fn (StateAssert $state) => $state->isResumed()))
            ->stateOn('Writer', $this->counting('cover', 1), fn (StateHandle $cover) => $cover
                ->steps([], fn (StateAssert $state) => $state->isFinished()));
    }

    public function test_a_finished_frame_and_a_popped_frame_answer_apart(): void
    {
        $this->journal
            ->pushState('Writer', $this->counting('a', 1))
            ->stateOn('Writer', $this->counting('a', 1), fn (StateHandle $counting) => $counting->event(
                new SubjectSeen('a'),
                function (StateAssert $state) {
                    $state->isFinished();
                    $this->assertThrows(fn () => $state->isPopped(), Throwable::class);
                },
            ));
    }

    public function test_a_value_that_is_missing_is_not_a_null_one(): void
    {
        $this->journal
            ->pushState('Writer', $this->counting('a', 1))
            ->stateOn('Writer', $this->counting('a', 1), fn (StateHandle $counting) => $counting->steps(
                [],
                function (StateAssert $state) {
                    $state->where('limit', 1);
                    $this->assertThrows(fn () => $state->where('missing', null), AssertionFailedError::class);
                },
            ));
    }

    public function test_a_state_already_on_the_stack_is_followed_and_one_never_pushed_has_no_frame(): void
    {
        $counting = $this->counting('a', 3);

        $this->journal
            ->pushState('Writer', $counting)
            ->stateOn('Writer', $counting, fn (StateHandle $state) => $state->event(
                new SubjectSeen('a'),
                fn (StateAssert $state) => $state->where('heard', 1),
            ))
            ->assertNoFrame('Writer', $this->counting('b', 3));
        $this->assertThrows(
            fn () => $this->journal->assertNoFrame($this->writerSession(), $counting),
            AssertionFailedError::class,
        );
    }

    public function test_a_hook_answered_through_the_journal_is_the_answer_of_the_stack(): void
    {
        $this->journal->pushState($this->writerSession(), $this->counting('a', 1));
        $driver = new DriverCapabilities('Test driver', 'stop replies', ['onStop'], RewriteSupport::WithoutApproval);

        $answer = $this->journal->answerHook(
            $this->writerSession(),
            SessionHook::stop()->inputFor($this->writerSession()->target),
            $driver,
        );

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
    }

    private function counting(string $subject, int $limit): StateReference
    {
        return new StateReference(
            StateReferenceKeys::of(CountFactsStateReference::class),
            new SubjectReference($subject, 1),
            ['subject' => $subject, 'limit' => $limit],
        );
    }

    private function writerSession(): AgentSession
    {
        return $this->journal->sessionOf('Writer');
    }

    private function assertOwnerActs(): void
    {
        $this->assertEquals(
            $this->journal->actorCalled('Owner'),
            $this->app->make(CurrentActor::class)->actor(),
        );
    }
}
