<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Support\ActorContext;
use App\Agents\Actions\StartSessions;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\SessionOption;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Domains read agents and running sessions through Core's readers: labels and session options, never the models.
 */
final class AgentResolversTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
    ];

    private Agent $builder;

    private Agent $reviewer;

    private AgentSession $running;

    private AgentSession $ended;

    private AgentSession $reviewing;

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = Agent::create('Builder', 'main-agent');
        $this->reviewer = Agent::create('Reviewer', 'main-agent');
        $start = $this->app->make(StartSessions::class);
        $this->running = $start->start(
            $this->builder,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->ended = $start->start(
            $this->builder,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->ended->endAt(CarbonImmutable::now());
        $this->reviewing = $start->start(
            $this->reviewer,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
    }

    public function test_the_user_sees_every_running_session_with_its_agent_name(): void
    {
        $this->actAs(TestActors::user(7));

        $this->assertSame(
            [[$this->running->id, 'Builder'], [$this->reviewing->id, 'Reviewer']],
            array_map(
                fn (SessionOption $option) => [$option->sessionId, $option->agentName],
                $this->sessions()->active(),
            ),
        );
    }

    public function test_an_agent_sees_only_its_own_running_sessions(): void
    {
        $this->actAsAgent($this->reviewer->id);

        $this->assertSame(
            [$this->reviewing->id],
            array_map(fn (SessionOption $option) => $option->sessionId, $this->sessions()->active()),
        );
    }

    public function test_a_running_session_gives_its_stack_target(): void
    {
        $this->actAs(TestActors::user(7));

        $target = $this->sessions()->requireActive($this->running->id);

        $this->assertSame([$this->builder->id, $this->running->id], [$target->agentId, $target->sessionId]);
    }

    public function test_an_ended_a_missing_and_another_agents_session_are_refused_alike(): void
    {
        $this->actAsAgent($this->reviewer->id);

        foreach ([$this->ended->id, TestIds::of(99999), $this->running->id] as $sessionId) {
            try {
                $this->sessions()->requireActive($sessionId);
                $this->fail("Session {$sessionId} was not refused.");
            } catch (StackTargetRefused $refused) {
                $this->assertSame(
                    "This request may not change the stack of session {$sessionId}.",
                    $refused->getMessage(),
                );
            }
        }
    }

    public function test_labels_cover_the_visible_agents_and_leave_out_the_rest(): void
    {
        $this->actAs(TestActors::user(7));
        $labels = $this->app->make(AgentResolver::class)->labelsFor(
            [$this->builder->id, TestIds::of(999999), $this->reviewer->id],
        );
        $this->assertSame(
            ['Builder', 'Reviewer'],
            [$labels[$this->builder->id]->name, $labels[$this->reviewer->id]->name],
        );
        $this->assertArrayNotHasKey(TestIds::of(999999), $labels);

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->reviewer->id),
            TestStartAuthority::forAgent($this->reviewer->id),
        );
        $this->assertSame(
            [$this->reviewer->id],
            array_keys($this->app->make(AgentResolver::class)->labelsFor([$this->builder->id, $this->reviewer->id])),
        );
    }

    public function test_without_an_actor_nothing_is_read(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->sessions()->active();
    }

    /**
     * Acts as the agent under the profile it starts with, as a real agent call does.
     */
    private function sessions(): SessionResolver
    {
        return $this->app->make(SessionResolver::class);
    }
}
