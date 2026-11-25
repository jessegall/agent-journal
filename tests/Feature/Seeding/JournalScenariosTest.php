<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Contracts\Actors\CurrentActor;
use App\Models\Agents\Agent;
use Tests\Fixtures\Domains\Counting\CountingDomain;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Fixtures\Seeding\ReviewerJoins;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\ScenarioRequirements;
use Tests\Support\Seeding\StartScenario;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * A shared start position runs on the journal only once what it needs is there and its names are free, gives back
 * what it started, and a step that fails leaves the actor before it in place.
 */
final class JournalScenariosTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_both_entry_forms_give_back_the_typed_result_and_leave_the_scenario_actor_acting(): void
    {
        $default = $this->journal->startScenario(ReviewerJoins::class);
        $named = $this->journal->startScenario(new ReviewerJoins('Editor'));

        $this->assertSame(
            [$this->journal->agentCalled('Reviewer')->id, $this->journal->agentCalled('Editor')->id],
            [$default->id, $named->id],
        );
        $this->assertActing('Editor');
    }

    public function test_a_missing_domain_is_refused_by_name_before_anything_is_written(): void
    {
        $scenario = $this->scenario(new ScenarioRequirements(domains: [CountingDomain::class]), ['Counter']);

        $this->assertThrows(
            fn () => $this->journal->startScenario($scenario),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::DomainNotBooted,
        );

        $this->assertFalse(Agent::query()->withoutGlobalScopes()->where('name', 'Counter')->exists());
    }

    public function test_a_name_the_journal_holds_is_refused_before_anything_is_written(): void
    {
        $this->journal->agent('Reviewer');
        $before = Agent::query()->withoutGlobalScopes()->count();

        $this->assertThrows(fn () => $this->journal->startScenario(ReviewerJoins::class), FixtureRefused::class);
        $this->assertThrows(
            fn () => $this->journal->startScenario($this->scenario(new ScenarioRequirements(makesOwner: true), [])),
            FixtureRefused::class,
        );
        $this->assertThrows(
            fn () => $this->journal->startScenario($this->scenario(new ScenarioRequirements(), ['Twin', 'Twin'])),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::FreshNameTwice,
        );

        $this->assertSame($before, Agent::query()->withoutGlobalScopes()->count());
    }

    public function test_a_failing_step_fails_with_its_own_exception_and_puts_the_actor_back(): void
    {
        $failing = new class implements StartScenario
        {
            public function requirements(): ScenarioRequirements
            {
                return new ScenarioRequirements();
            }

            public function freshNames(): array
            {
                return ['Helper'];
            }

            public function start(TestJournal $journal): never
            {
                $journal->agent('Helper')->actAs('Helper');

                throw TestFailure::failedAfterTheStart();
            }
        };

        $this->assertThrows(fn () => $this->journal->startScenario($failing), TestFailure::class);

        $this->assertActing('Owner');
    }

    /**
     * A scenario with these needs and names that starts nothing.
     *
     * @param  list<string>  $freshNames
     * @return StartScenario<null>
     */
    private function scenario(ScenarioRequirements $requirements, array $freshNames): StartScenario
    {
        return new readonly class($requirements, $freshNames) implements StartScenario
        {
            /**
             * @param  list<string>  $freshNames
             */
            public function __construct(private ScenarioRequirements $requirements, private array $freshNames) {}

            public function requirements(): ScenarioRequirements
            {
                return $this->requirements;
            }

            public function freshNames(): array
            {
                return $this->freshNames;
            }

            public function start(TestJournal $journal): null
            {
                foreach ($this->freshNames as $name) {
                    $journal->agent($name);
                }

                return null;
            }
        };
    }

    private function assertActing(string $name): void
    {
        $this->assertEquals(
            $this->journal->actorCalled($name),
            $this->app->make(CurrentActor::class)->actor(),
        );
    }
}
