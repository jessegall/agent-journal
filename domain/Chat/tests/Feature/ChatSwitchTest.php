<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\Messages\AskMessage\AskMessageCommand;
use App\Commands\Settings\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Enums\Assignments\ActorType;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Messages\MessageAttention;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\StartSessions;
use App\Values\GroupReference;
use Domain\Chat\Tests\TestCase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * Chat sits behind the generic domain switch: switched off, its pages and actions are gone while Core messaging
 * still sends and asks the destination to attend; switched on again, Chat reads the current state.
 */
final class ChatSwitchTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
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
        $agent = Agent::create('Builder', 'main-agent');

        $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());

        $ownInboxId = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $agentInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $agent->id))->inboxId();
        $this->startUserRequestAs($owner->id);
        $this->runOnBus(new DisableSettingGroupCommand(new GroupReference('Core', 'domain_chat'), 0));
        $this->app->forgetScopedInstances();

        $this->actingAs($owner)->get('/chat/inbox')->assertNotFound();
        $this->actingAs($owner)->get('/')->assertOk();

        $this->startUserRequestAs($owner->id);
        $this->runOnBus(new AskMessageCommand($ownInboxId, $agentInboxId, 'Still there?'));
        $this->assertSame(1, MessageAttention::query()->count());

        $this->runOnBus(new EnableSettingGroupCommand(new GroupReference('Core', 'domain_chat'), 1));
        $this->app->forgetScopedInstances();

        $this->actingAs($owner)->get('/chat/inbox')->assertOk();
    }
}
