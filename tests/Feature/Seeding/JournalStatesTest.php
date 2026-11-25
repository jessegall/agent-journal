<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Contracts\Actors\CurrentActor;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Hooks\AnswerType;
use App\Models\Agents\AgentSession;
use App\Providers\DomainEventServiceProvider;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Inputs\StopRequested;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Fixtures\Domains\Counting\CountingDomain;
use Tests\Fixtures\Domains\Counting\Events\SubjectSeen;
use Tests\Fixtures\Domains\Counting\States\CountFactsState;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\Ticks\ScriptedOccurrenceGuard;
use Tests\Fixtures\Hooks\Ticks\ScriptedTickState;
use Tests\Fixtures\Hooks\Ticks\TickScript;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RegistersTestStates;
use Tests\Support\ScenarioTick;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\StateObservation;
use Tests\TestCase;
use Throwable;

/**
 * A state of a test on an agent's real stack: bound to its one frame, answering hooks as the agent, hearing facts
 * through the dispatcher and ticks through an engine pass, and observed after each given step.
 */
final class JournalStatesTest extends TestCase
{
    use CommitsHookRows;
    use InstallsCommandModules;
    use RegistersTestStates;

    /**
     * Facts reach a stack only once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

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
        $this->journal->pushState($this->writerSession(), $this->counting('a', 1));

        $this->assertThrows(
            fn () => $this->journal->pushState($this->writerSession(), $this->counting('a', 1)),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::NotOneFrame,
        );
    }

    public function test_a_push_the_engine_keeps_on_one_frame_binds_that_frame(): void
    {
        $task = new StateReference('test.tasks', new SubjectReference('42', 1), ['number' => 42, 'runNumber' => 1]);
        $this->journal->pushState($this->writerSession(), $task);

        $this->journal->pushState(
            $this->writerSession(),
            $task,
        )->given([], function (StateObservation $state) use ($task) {
            $state->assertOnTop();
            $state->assertPresent($task);
        });
    }

    public function test_a_hook_is_answered_by_the_state_and_the_prior_actor_comes_back(): void
    {
        $this->journal->actAs('Owner');

        $this->journal->pushState($this->writerSession(), $this->counting('a', 1))->given(
            $this->stop(),
            function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Deny);
                $state->assertAnswer(AnswerType::Deny);
            },
        );

        $this->assertOwnerActs();
    }

    public function test_a_hook_that_fails_still_puts_the_prior_actor_back(): void
    {
        $this->journal->actAs('Owner');
        $silent = new DriverCapabilities('Silent driver', 'no replies', [], RewriteSupport::WithoutApproval);
        $handle = $this->journal->pushState($this->writerSession(), $this->counting('a', 1))->answeredFor($silent);

        $this->assertThrows(fn () => $handle->given($this->stop(), fn () => null), Throwable::class);

        $this->assertOwnerActs();
    }

    public function test_a_fact_reaches_the_frame_and_leaves_no_answer_to_read(): void
    {
        $this->journal->pushState($this->writerSession(), $this->counting('a', 3))->given(
            new SubjectSeen('a'),
            function (StateObservation $state) {
                $state->assertValue('heard', 1);
                $state->assertLive();
                $this->assertThrows(
                    fn () => $state->assertAnswer(AnswerType::Deny),
                    fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::NoHookAnswer,
                );
            },
        );
    }

    public function test_a_tick_runs_an_engine_pass(): void
    {
        $ticking = new StateReference('test.ticking', new SubjectReference('a', 1), ['subject' => 'a']);

        $this->journal->pushState($this->writerSession(), $ticking)->given(
            new ScenarioTick(),
            fn () => $this->assertCount(1, $this->ticks->ticks['a'] ?? []),
        );
    }

    public function test_a_list_of_facts_ends_as_the_same_facts_given_one_by_one(): void
    {
        $this->journal->pushState($this->writerSession(), $this->counting('a', 3))
            ->given(
                [new SubjectSeen('a'), new SubjectSeen('a')],
                fn (StateObservation $state) => $state->assertValue('heard', 2),
            );

        $this->journal->pushState($this->writerSession(), $this->counting('b', 3))
            ->given(new SubjectSeen('b'), fn () => null)
            ->given(new SubjectSeen('b'), fn (StateObservation $state) => $state->assertValue('heard', 2));
    }

    public function test_a_covered_frame_keeps_its_id_and_resumes_on_top_once_the_cover_finished(): void
    {
        $under = $this->journal->pushState($this->writerSession(), $this->counting('under', 1));
        $cover = $this->journal->pushState($this->writerSession(), $this->counting('cover', 1));

        $under->given(new SubjectSeen('other'), fn (StateObservation $state) => $state->assertCovered());
        $under->given(new SubjectSeen('cover'), fn (StateObservation $state) => $state->assertResumed());
        $cover->given([], fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_finished_frame_and_a_popped_frame_answer_apart(): void
    {
        $counting = $this->journal->pushState($this->writerSession(), $this->counting('a', 1));

        $counting->given(new SubjectSeen('a'), function (StateObservation $state) {
            $state->assertFinished();
            $this->assertThrows(fn () => $state->assertPopped(), Throwable::class);
        });
    }

    public function test_a_value_that_is_missing_is_not_a_null_one(): void
    {
        $this->journal->pushState(
            $this->writerSession(),
            $this->counting('a', 1),
        )->given([], function (StateObservation $state) {
            $this->assertThrows(
                fn () => $state->assertValue('missing', null),
                AssertionFailedError::class,
            );
            $state->assertValue('limit', 1);
        });
    }

    public function test_a_state_already_on_the_stack_is_followed_and_one_never_pushed_has_no_frame(): void
    {
        $counting = $this->counting('a', 3);
        $this->journal->pushState($this->writerSession(), $counting);

        $this->journal->stateOn($this->writerSession(), $counting)->given(
            new SubjectSeen('a'),
            fn (StateObservation $state) => $state->assertValue('heard', 1),
        );

        $this->journal->assertNoFrame($this->writerSession(), $this->counting('b', 3));
        $this->assertThrows(
            fn () => $this->journal->assertNoFrame($this->writerSession(), $counting),
            AssertionFailedError::class,
        );
    }

    public function test_a_hook_answered_through_the_journal_is_the_answer_of_the_stack(): void
    {
        $this->journal->pushState($this->writerSession(), $this->counting('a', 1));
        $driver = new DriverCapabilities('Test driver', 'stop replies', ['onStop'], RewriteSupport::WithoutApproval);

        $answer = $this->journal->answerHook($this->writerSession(), $this->stop(), $driver);

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
    }

    private function counting(string $subject, int $limit): StateReference
    {
        return new StateReference(
            CountFactsState::TYPE_KEY,
            new SubjectReference($subject, 1),
            ['subject' => $subject, 'limit' => $limit],
        );
    }

    private function writerSession(): AgentSession
    {
        return $this->journal->sessionOf('Writer');
    }

    private function stop(): StopRequested
    {
        return $this->journal->hooksFor($this->writerSession())->stop();
    }

    private function assertOwnerActs(): void
    {
        $this->assertEquals(
            $this->journal->actorCalled('Owner'),
            $this->app->make(CurrentActor::class)->actor(),
        );
    }
}
