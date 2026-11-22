<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RequestProgress;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Communication\Commands\AskMessage\AskMessageCommand;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Models\Message;
use App\Settings\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Settings\Values\GroupReference;
use Tests\Support\MessagingTestCase;

/**
 * The messaging traces of plan 26's phase 4 review (doc 40 revision 3, section 59): messages sent while no host
 * takes requests stay committed and share one durable wake, and messaging between agents still wakes them with Chat
 * switched off. Neither a wake nor its delivery marks a message read.
 */
final class MessageWakeTracesTest extends MessagingTestCase
{
    public function test_messages_sent_while_the_host_is_away_stay_committed_and_share_one_open_wake(): void
    {
        foreach (['One', 'Two', 'Three'] as $body) {
            $this->ownerSends($this->inboxIdOf($this->builder), $body);
        }

        $wake = $this->wakeOf($this->builder);
        $counts = $this->app->make(ConversationResolver::class)->counts($this->inboxIdOf($this->builder));
        $this->assertSame(3, Message::query()->count());
        $this->assertSame(RequestProgress::Accepted, $wake->progress);
        $this->assertSame([3, 0], [$wake->wake_requested, $wake->wake_acknowledged]);
        $this->assertSame(3, $counts->unread);
    }

    public function test_agents_still_message_and_wake_each_other_with_chat_switched_off(): void
    {
        $this->asOwner();
        $this->runOnBus(new DisableSettingGroupCommand(new GroupReference('Core', 'domain_chat'), 0));
        $this->app->forgetScopedInstances();
        $this->asAgent($this->builder);

        $this->runOnBus(new AskMessageCommand(
            $this->inboxIdOf($this->builder),
            $this->inboxIdOf($this->reviewer),
            'Still there with Chat off?',
        ));

        $this->assertSame(1, $this->wakeOf($this->reviewer)->wake_requested);
    }

    /**
     * The one wake request open on the session's runtime.
     */
    private function wakeOf(AgentSession $session): DriverRequest
    {
        $runtime = AgentRuntime::query()->where('agent_session_id', $session->id)->sole();

        return DriverRequest::query()
            ->where('agent_runtime_id', $runtime->id)
            ->where('operation', DriverOperation::Wake)
            ->sole();
    }
}
