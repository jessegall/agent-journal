<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\StackTarget;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Communication\Readers\MessageRecords;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Readers\Support\SequenceRecords;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
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
        Message::query()->create(['body' => 'Not addressed yet']);
        new Memory(['text' => 'Kept by agent 1', 'weight' => 3])->saveFor(new ActorIdentity(ActorType::Agent, TestIds::of(1)));
        new Memory(['text' => 'Kept by agent 2', 'weight' => 3])->saveFor(new ActorIdentity(ActorType::Agent, TestIds::of(2)));
        Task::factory()->create(['title' => 'Write the walk'])->start();
        Rule::query()->create(['text' => 'No phase waits on the user.']);
    }

    public function test_an_agent_sees_its_own_messages_runs_and_memories_in_every_session(): void
    {
        $this->startRequestAs(TestIds::of(1), TestIds::of(10));

        $this->assertSame(['For agent 1', 'For agent 1'], Message::query()->orderBy('id')->pluck('body')->all());
        $this->assertSame(['Run of agent 1', 'Run of agent 1'], SequenceRun::query()->orderBy('id')->pluck('name')->all());
        $this->assertSame(['Kept by agent 1'], Memory::query()->pluck('text')->all());

        $this->app->forgetScopedInstances();
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));

        $this->assertSame(['For agent 2'], Message::query()->pluck('body')->all());
        $this->assertSame(['Run of agent 2'], SequenceRun::query()->pluck('name')->all());
        $this->assertSame(['Kept by agent 2'], Memory::query()->pluck('text')->all());
    }

    public function test_a_message_not_yet_addressed_belongs_to_no_agent(): void
    {
        $this->startRequestAs(TestIds::of(1), TestIds::of(10));

        $this->assertNotContains('Not addressed yet', Message::query()->pluck('body')->all());
    }

    public function test_another_agents_message_is_missing_to_the_caller(): void
    {
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));
        $messageOfAgentOne = $this->idOf(Message::query()->ownedBy(TestIds::of(1)));

        $this->expectException(MessageMissing::class);

        $this->app->make(MessageRecords::class)->get($messageOfAgentOne);
    }

    public function test_the_journal_reads_what_it_addressed_to_another_agent_by_name(): void
    {
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));
        $agentOne = new StackTarget(TestIds::of(1), TestIds::of(10));

        $message = $this->app->make(MessageRecords::class)->addressedTo($agentOne, $this->idOf(Message::query()->ownedBy(TestIds::of(1))));
        $run = $this->app->make(SequenceRecords::class)->followedBy($agentOne, $this->idOf(SequenceRun::query()->ownedBy(new ActorIdentity(ActorType::Agent, TestIds::of(1)))));

        $this->assertSame([TestIds::of(1), TestIds::of(1)], [$message->agent_id, $run->actor_id]);
        $this->assertSame(['Kept by agent 1'], Memory::query()->ownedBy(new ActorIdentity(ActorType::Agent, TestIds::of(1)))->pluck('text')->all());
    }

    public function test_every_agent_reads_every_task_and_rule(): void
    {
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));

        $this->assertSame(['Write the walk'], Task::query()->pluck('title')->all());
        $this->assertSame(['No phase waits on the user.'], Rule::query()->pluck('text')->all());
    }

    public function test_a_query_after_the_request_ended_fails_instead_of_reading_everything(): void
    {
        $this->startRequestAs(TestIds::of(1), TestIds::of(10));
        Memory::query()->get();
        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);

        Memory::query()->get();
    }

    public function test_the_limit_comes_back_after_the_models_boot_again(): void
    {
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));
        Message::query()->get();

        Model::clearBootedModels();

        $this->assertSame(['For agent 2'], Message::query()->pluck('body')->all());
        $this->assertSame(['Kept by agent 2'], Memory::query()->pluck('text')->all());
    }

    public function test_a_user_reads_every_agents_messages_runs_and_memories_through_the_user_read(): void
    {
        $this->startUserRequestAs(TestIds::of(7));

        $this->assertSame(['For agent 1', 'For agent 1', 'For agent 2', 'Not addressed yet'], Message::query()->visibleToUser()->orderBy('id')->pluck('body')->all());
        $this->assertSame(3, SequenceRun::query()->visibleToUser()->count());
        $this->assertSame(['Kept by agent 1', 'Kept by agent 2'], Memory::query()->visibleToUser()->orderBy('id')->pluck('text')->all());
    }

    public function test_an_agent_cannot_use_the_user_read(): void
    {
        $this->startRequestAs(TestIds::of(1), TestIds::of(10));

        $this->expectException(UserActorRequired::class);

        Message::query()->visibleToUser()->get();
    }

    public function test_a_user_route_binds_any_agents_message_and_an_agent_only_its_own(): void
    {
        $messageOfAgentOne = $this->idOf(Message::query()->ownedBy(TestIds::of(1)));

        $this->startUserRequestAs(TestIds::of(7));
        $this->assertSame('For agent 1', new Message()->resolveRouteBinding($messageOfAgentOne)?->body);

        $this->app->forgetScopedInstances();
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));
        $this->assertNull(new Message()->resolveRouteBinding($messageOfAgentOne));
    }

    public function test_route_binding_without_an_actor_fails_before_reading(): void
    {
        $messageOfAgentOne = $this->idOf(Message::query()->ownedBy(TestIds::of(1)));

        $this->expectException(ActorContextMissing::class);

        new Message()->resolveRouteBinding($messageOfAgentOne);
    }

    private function giveWorkTo(int $agent, int $session): void
    {
        $target = new StackTarget(TestIds::of($agent), TestIds::of($session));
        Message::query()->create(['body' => "For agent {$agent}"])->requireAnswerFrom($target);
        SequenceRun::query()->create(['name' => "Run of agent {$agent}", 'steps' => ['Read the brief.']])->startFor($target->actorIdentity());
    }

    /**
     * @param  Builder<covariant Model>  $query
     */
    private function idOf(Builder $query): string
    {
        return (string) $query->orderBy('id')->value('id');
    }
}
