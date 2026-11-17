<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Support\ActorContext;
use App\Core\Agents\Actions\LaunchSessions;
use App\Core\Agents\Contracts\AgentReader;
use App\Core\Agents\Contracts\SessionReader;
use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\Support\SessionOption;
use App\Core\Contracts\CurrentActorSetter;
use App\Core\Hooks\Exceptions\StackTargetRefused;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Domains read agents and running sessions through Core's readers: labels and session options, never the models.
 */
final class AgentReadersTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'links'];

    private Agent $builder;

    private Agent $reviewer;

    private AgentSession $running;

    private AgentSession $ended;

    private AgentSession $reviewing;

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.main_ready']);
        $this->reviewer = Agent::query()->create(['name' => 'Reviewer', 'role' => 'hooks.main_ready']);
        $launch = $this->app->make(LaunchSessions::class);
        $this->running = $launch->launch($this->builder, 'claude-code')->session;
        $this->ended = $launch->launch($this->builder, 'claude-code')->session;
        $this->ended->endAt(CarbonImmutable::now());
        $this->reviewing = $launch->launch($this->reviewer, 'claude-code')->session;
    }

    public function test_the_user_sees_every_running_session_with_its_agent_name(): void
    {
        $this->actAs(ActorContext::forUser(7));

        $this->assertSame(
            [[$this->running->id, 'Builder'], [$this->reviewing->id, 'Reviewer']],
            array_map(fn (SessionOption $option) => [$option->sessionId, $option->agentName], $this->sessions()->active()),
        );
    }

    public function test_an_agent_sees_only_its_own_running_sessions(): void
    {
        $this->actAs(ActorContext::forAgent($this->reviewer->id));

        $this->assertSame([$this->reviewing->id], array_map(fn (SessionOption $option) => $option->sessionId, $this->sessions()->active()));
    }

    public function test_a_running_session_gives_its_stack_target(): void
    {
        $this->actAs(ActorContext::forUser(7));

        $target = $this->sessions()->requireActive($this->running->id);

        $this->assertSame([$this->builder->id, $this->running->id], [$target->agentId, $target->sessionId]);
    }

    public function test_an_ended_a_missing_and_another_agents_session_are_refused_alike(): void
    {
        $this->actAs(ActorContext::forAgent($this->reviewer->id));

        foreach ([$this->ended->id, 999999, $this->running->id] as $sessionId) {
            try {
                $this->sessions()->requireActive($sessionId);
                $this->fail("Session {$sessionId} was not refused.");
            } catch (StackTargetRefused $refused) {
                $this->assertSame("This request may not change the stack of session {$sessionId}.", $refused->getMessage());
            }
        }
    }

    public function test_labels_cover_the_visible_agents_and_leave_out_the_rest(): void
    {
        $this->actAs(ActorContext::forUser(7));
        $labels = $this->app->make(AgentReader::class)->labelsFor([$this->builder->id, 999999, $this->reviewer->id]);
        $this->assertSame(['Builder', 'Reviewer'], [$labels[$this->builder->id]->name, $labels[$this->reviewer->id]->name]);
        $this->assertArrayNotHasKey(999999, $labels);

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($this->reviewer->id));
        $this->assertSame([$this->reviewer->id], array_keys($this->app->make(AgentReader::class)->labelsFor([$this->builder->id, $this->reviewer->id])));
    }

    public function test_without_an_actor_nothing_is_read(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->sessions()->active();
    }

    private function actAs(ActorContext $actor): void
    {
        $this->app->make(CurrentActorSetter::class)->set($actor);
    }

    private function sessions(): SessionReader
    {
        return $this->app->make(SessionReader::class);
    }
}
