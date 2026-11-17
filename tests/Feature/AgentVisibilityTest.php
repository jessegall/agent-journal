<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\PersonActorRequired;
use App\Core\Agents\Exceptions\AgentContextMissing;
use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Chat\Exceptions\MessageMissing;
use App\Domain\Chat\MessageRecords;
use App\Domain\Chat\Models\Message;
use App\Domain\Memory\Models\Memory;
use App\Domain\Rules\Models\Rule;
use App\Domain\Sequences\Models\SequenceRun;
use App\Domain\Sequences\SequenceRecords;
use App\Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class AgentVisibilityTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->giveWorkTo(new StackTarget(1, 10));
        $this->giveWorkTo(new StackTarget(1, 11));
        $this->giveWorkTo(new StackTarget(2, 20));
        Message::query()->create(['body' => 'Not addressed yet']);
        (new Memory(['text' => 'Kept by agent 1', 'weight' => 3]))->keepFor(1);
        (new Memory(['text' => 'Kept by agent 2', 'weight' => 3]))->keepFor(2);
        Task::query()->create(['title' => 'Write the walk'])->startFor(new StackTarget(1, 10));
        Rule::query()->create(['text' => 'No phase waits on the user.']);
    }

    public function test_an_agent_sees_its_own_messages_runs_and_memories_in_every_session(): void
    {
        $this->startRequestAs(1, 10);

        $this->assertSame(['For agent 1', 'For agent 1'], Message::query()->orderBy('id')->pluck('body')->all());
        $this->assertSame([10, 11], SequenceRun::query()->orderBy('id')->pluck('session_id')->all());
        $this->assertSame(['Kept by agent 1'], Memory::query()->pluck('text')->all());

        $this->app->forgetScopedInstances();
        $this->startRequestAs(2, 20);

        $this->assertSame(['For agent 2'], Message::query()->pluck('body')->all());
        $this->assertSame([20], SequenceRun::query()->pluck('session_id')->all());
        $this->assertSame(['Kept by agent 2'], Memory::query()->pluck('text')->all());
    }

    public function test_a_message_not_yet_addressed_belongs_to_no_agent(): void
    {
        $this->startRequestAs(1, 10);

        $this->assertNotContains('Not addressed yet', Message::query()->pluck('body')->all());
    }

    public function test_another_agents_message_is_missing_to_the_caller(): void
    {
        $this->startRequestAs(2, 20);
        $messageOfAgentOne = $this->idOf(Message::query()->ownedBy(1));

        $this->expectException(MessageMissing::class);

        $this->app->make(MessageRecords::class)->get($messageOfAgentOne);
    }

    public function test_the_journal_reads_what_it_addressed_to_another_agent_by_name(): void
    {
        $this->startRequestAs(2, 20);
        $agentOne = new StackTarget(1, 10);

        $message = $this->app->make(MessageRecords::class)->addressedTo($agentOne, $this->idOf(Message::query()->ownedBy(1)));
        $run = $this->app->make(SequenceRecords::class)->followedBy($agentOne, $this->idOf(SequenceRun::query()->ownedBy(1)));

        $this->assertSame([1, 1], [$message->agent_id, $run->agent_id]);
        $this->assertSame(['Kept by agent 1'], Memory::query()->ownedBy(1)->pluck('text')->all());
    }

    public function test_every_agent_reads_every_task_and_rule(): void
    {
        $this->startRequestAs(2, 20);

        $this->assertSame(['Write the walk'], Task::query()->pluck('title')->all());
        $this->assertSame(['No phase waits on the user.'], Rule::query()->pluck('text')->all());
    }

    public function test_a_query_after_the_request_ended_fails_instead_of_reading_everything(): void
    {
        $this->startRequestAs(1, 10);
        Memory::query()->get();
        $this->app->forgetScopedInstances();

        $this->expectException(AgentContextMissing::class);

        Memory::query()->get();
    }

    public function test_the_limit_comes_back_after_the_models_boot_again(): void
    {
        $this->startRequestAs(2, 20);
        Message::query()->get();

        Model::clearBootedModels();

        $this->assertSame(['For agent 2'], Message::query()->pluck('body')->all());
        $this->assertSame(['Kept by agent 2'], Memory::query()->pluck('text')->all());
    }

    public function test_a_person_reads_every_agents_messages_runs_and_memories_through_the_person_read(): void
    {
        $this->startPersonRequestAs(7);

        $this->assertSame(['For agent 1', 'For agent 1', 'For agent 2', 'Not addressed yet'], Message::query()->visibleToPerson()->orderBy('id')->pluck('body')->all());
        $this->assertSame(3, SequenceRun::query()->visibleToPerson()->count());
        $this->assertSame(['Kept by agent 1', 'Kept by agent 2'], Memory::query()->visibleToPerson()->orderBy('id')->pluck('text')->all());
    }

    public function test_an_agent_cannot_use_the_person_read(): void
    {
        $this->startRequestAs(1, 10);

        $this->expectException(PersonActorRequired::class);

        Message::query()->visibleToPerson()->get();
    }

    public function test_a_person_route_binds_any_agents_message_and_an_agent_only_its_own(): void
    {
        $messageOfAgentOne = $this->idOf(Message::query()->ownedBy(1));

        $this->startPersonRequestAs(7);
        $this->assertSame('For agent 1', (new Message)->resolveRouteBinding($messageOfAgentOne)?->body);

        $this->app->forgetScopedInstances();
        $this->startRequestAs(2, 20);
        $this->assertNull((new Message)->resolveRouteBinding($messageOfAgentOne));
    }

    public function test_route_binding_without_an_actor_fails_before_reading(): void
    {
        $messageOfAgentOne = $this->idOf(Message::query()->ownedBy(1));

        $this->expectException(ActorContextMissing::class);

        (new Message)->resolveRouteBinding($messageOfAgentOne);
    }

    private function giveWorkTo(StackTarget $target): void
    {
        Message::query()->create(['body' => "For agent {$target->agentId}"])->requireAnswerFrom($target);
        SequenceRun::query()->create(['name' => "Run of agent {$target->agentId}", 'steps' => ['Read the brief.']])->startFor($target);
    }

    /**
     * @param  Builder<covariant Model>  $query
     */
    private function idOf(Builder $query): int
    {
        return (int) $query->orderBy('id')->value('id');
    }
}
