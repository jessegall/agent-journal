<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\AskMessage;
use App\Communication\Models\MessageAttention;
use App\Desks\Commands\CreateDesk;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensDriverRuntimes;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A message to a desk asks each occupant once: those running in a runtime are woken, the others are recorded with no
 * runtime, and a replay of the same origin asks nobody again.
 */
final class MessageAttentionTest extends TestCase
{
    use CommitsHookRows;
    use OpensDriverRuntimes;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'agent_runtimes',
        'driver_requests',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
    ];

    public function test_each_occupant_is_asked_once_per_message_and_only_running_ones_are_woken(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $deskId = $this->app->make(CommandBus::class)->run(new CreateDesk('Team', 3, false));
        $desk = DeskRecord::query()->whereKey($deskId)->sole();
        $running = [Agent::named('First', AgentRole::MainAgent), Agent::named('Second', AgentRole::MainAgent)];
        $idle = Agent::named('Idle', AgentRole::MainAgent);

        foreach ([...$running, $idle] as $agent) {
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(SeatingWriter::class)->seat($desk->id, ActorIdentity::of($agent)),
            );
        }

        foreach ($running as $agent) {
            $launched = $this->app->make(LaunchSessions::class)
                ->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId());
            $this->openDriverRuntime($launched->session);
        }

        $source = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $key = (string) Str::ulid();
        $this->app->make(RequestKey::class)->set($key);
        $this->app->make(CommandBus::class)->run(new AskMessage($source, $desk->inboxId(), 'Who takes this?'));
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($owner->id);
        $this->app->make(RequestKey::class)->set($key);
        $this->app->make(CommandBus::class)->run(new AskMessage($source, $desk->inboxId(), 'Who takes this?'));

        $this->assertSame(3, MessageAttention::query()->count());
        $this->assertSame(2, MessageAttention::query()->whereNotNull('request_id')->count());
        $this->assertNull(MessageAttention::query()->where('actor_id', $idle->id)->sole()->request_id);
    }
}
