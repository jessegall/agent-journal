<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\CrossOwnerReadRefused;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

final class AgentVisibilityTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->giveWorkTo(1, 10);
        $this->giveWorkTo(1, 11);
        $this->giveWorkTo(2, 20);
        new Memory(['text' => 'Kept by agent 1', 'weight' => 3])->saveFor(TestActors::agentIdentity(1));
        new Memory(['text' => 'Kept by agent 2', 'weight' => 3])->saveFor(TestActors::agentIdentity(2));
        Task::factory()->create(['title' => 'Write the walk'])->start();
        Rule::holding('No phase waits on the user.');
    }

    public function test_an_agent_sees_its_own_runs_and_memories_in_every_session(): void
    {
        $this->startTestAgentRequest(1, 10);

        $this->assertSame(['Run of agent 1', 'Run of agent 1'], SequenceRun::query()->orderBy('id')->pluck('name')->all());
        $this->assertSame(['Kept by agent 1'], Memory::query()->pluck('text')->all());

        $this->app->forgetScopedInstances();
        $this->startTestAgentRequest(2, 20);

        $this->assertSame(['Run of agent 2'], SequenceRun::query()->pluck('name')->all());
        $this->assertSame(['Kept by agent 2'], Memory::query()->pluck('text')->all());
    }

    public function test_the_journal_reads_what_it_addressed_to_another_agent_by_name(): void
    {
        $this->startTestAgentRequest(2, 20);
        $agentOne = TestActors::stack(1, 10);

        $run = $this->app->make(SequenceRecords::class)->followedBy($agentOne, $this->idOf(SequenceRun::query()->ownedBy(TestActors::agentIdentity(1))));

        $this->assertSame(TestIds::of(1), $run->actor_id);
        $this->assertSame(['Kept by agent 1'], Memory::query()->ownedBy(TestActors::agentIdentity(1))->pluck('text')->all());
    }

    public function test_every_agent_reads_every_task_and_rule(): void
    {
        $this->startTestAgentRequest(2, 20);

        $this->assertSame(['Write the walk'], Task::query()->pluck('title')->all());
        $this->assertSame(['No phase waits on the user.'], Rule::query()->pluck('text')->all());
    }

    public function test_a_query_after_the_request_ended_fails_instead_of_reading_everything(): void
    {
        $this->startTestAgentRequest(1, 10);
        Memory::query()->get();
        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);

        Memory::query()->get();
    }

    public function test_the_limit_comes_back_after_the_models_boot_again(): void
    {
        $this->startTestAgentRequest(2, 20);
        SequenceRun::query()->get();

        Model::clearBootedModels();

        $this->assertSame(['Run of agent 2'], SequenceRun::query()->pluck('name')->all());
        $this->assertSame(['Kept by agent 2'], Memory::query()->pluck('text')->all());
    }

    public function test_a_user_reads_every_agents_runs_and_memories_through_the_user_read(): void
    {
        $this->startTestUserRequest(7);

        $this->assertSame(3, SequenceRun::query()->acrossOwners()->count());
        $this->assertSame(['Kept by agent 1', 'Kept by agent 2'], Memory::query()->acrossOwners()->orderBy('id')->pluck('text')->all());
    }

    public function test_an_agent_cannot_use_the_user_read(): void
    {
        $this->startTestAgentRequest(1, 10);

        $this->expectException(CrossOwnerReadRefused::class);

        SequenceRun::query()->acrossOwners()->get();
    }

    public function test_a_user_route_binds_any_agents_run_and_an_agent_only_its_own(): void
    {
        $runOfAgentOne = $this->runOfAgentOne();

        $this->startTestUserRequest(7);
        $this->assertSame('Run of agent 1', new SequenceRun()->resolveRouteBinding($runOfAgentOne)?->name);

        $this->app->forgetScopedInstances();
        $this->startTestAgentRequest(2, 20);
        $this->assertNull(new SequenceRun()->resolveRouteBinding($runOfAgentOne));
    }

    public function test_route_binding_without_an_actor_fails_before_reading(): void
    {
        $runOfAgentOne = $this->runOfAgentOne();

        $this->expectException(ActorContextMissing::class);

        new SequenceRun()->resolveRouteBinding($runOfAgentOne);
    }

    private function giveWorkTo(int $agent, int $session): void
    {
        $target = TestActors::stack($agent, $session);
        SequenceRun::written("Run of agent {$agent}", ['Read the brief.'])->startFor($target->actorIdentity());
    }

    /**
     * @param  Builder<covariant Model>  $query
     */
    private function idOf(Builder $query): string
    {
        return (string) $query->orderBy('id')->value('id');
    }

    private function runOfAgentOne(): string
    {
        return $this->idOf(SequenceRun::query()->ownedBy(TestActors::agentIdentity(1)));
    }
}
