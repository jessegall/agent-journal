<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\AskMessage;
use App\Communication\Models\MessageAttention;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Values\GroupReference;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * Chat sits behind the generic domain switch: switched off, its pages and actions are gone while Core messaging
 * still sends and asks the destination to attend; switched on again, Chat reads the current state.
 */
final class ChatSwitchTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'links',
        'settings_records',
    ];

    public function test_chat_off_removes_its_pages_while_core_messaging_still_works(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $agent = Agent::named('Builder', 'main-agent');
        $this->app->make(LaunchSessions::class)
            ->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId());
        $ownInboxId = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $agentInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $agent->id))->inboxId();
        $this->startUserRequestAs($owner->id);
        $this->runOnBus(new DisableSettingGroup(new GroupReference('Core', 'domain_chat'), 0));
        $this->app->forgetScopedInstances();

        $this->actingAs($owner)->get('/chat/inbox')->assertNotFound();
        $this->actingAs($owner)->get('/')->assertOk();

        $this->startUserRequestAs($owner->id);
        $this->runOnBus(new AskMessage($ownInboxId, $agentInboxId, 'Still there?'));
        $this->assertSame(1, MessageAttention::query()->count());

        $this->runOnBus(new EnableSettingGroup(new GroupReference('Core', 'domain_chat'), 1));
        $this->app->forgetScopedInstances();

        $this->actingAs($owner)->get('/chat/inbox')->assertOk();
    }

    private function runOnBus(object $command): mixed
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
