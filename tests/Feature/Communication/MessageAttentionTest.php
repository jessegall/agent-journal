<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\CreateDesk\CreateDeskCommand;
use App\Contracts\AssignmentTransaction;
use App\Contracts\CommandBus;
use App\Models\Agent;
use App\Models\DeskRecord;
use App\Models\MessageAttention;
use App\Support\ActorIdentity;
use App\Support\DeskSeating;
use App\Support\RequestKey;
use App\Support\StartSessions;
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
        'start_tokens',
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
        $deskId = $this->app->make(CommandBus::class)->run(new CreateDeskCommand('Team', 3, false));
        $desk = DeskRecord::query()->whereKey($deskId)->sole();
        $running = [Agent::create('First', 'main-agent'), Agent::create('Second', 'main-agent')];
        $idle = Agent::create('Idle', 'main-agent');

        foreach ([...$running, $idle] as $agent) {
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(DeskSeating::class)->seat($desk->id, ActorIdentity::of($agent)),
            );
        }

        foreach ($running as $agent) {
            $started = $this->app->make(StartSessions::class)
                ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());
            $this->openDriverRuntime($started->session);
        }

        $source = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $key = (string) Str::ulid();
        $this->app->make(RequestKey::class)->set($key);
        $this->app->make(CommandBus::class)->run(new AskMessageCommand($source, $desk->inboxId(), 'Who takes this?'));
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($owner->id);
        $this->app->make(RequestKey::class)->set($key);
        $this->app->make(CommandBus::class)->run(new AskMessageCommand($source, $desk->inboxId(), 'Who takes this?'));

        $this->assertSame(3, MessageAttention::query()->count());
        $this->assertSame(2, MessageAttention::query()->whereNotNull('request_id')->count());
        $this->assertNull(MessageAttention::query()->where('actor_id', $idle->id)->sole()->request_id);
    }
}
