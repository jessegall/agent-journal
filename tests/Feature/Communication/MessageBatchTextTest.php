<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Commands\Messages\ReplyToMessage\ReplyToMessageCommand;
use App\Data\Messages\MessageBatchItemData;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\McpCatalogue;
use App\Mcp\Tools\MessageBatchAcknowledgeTool;
use App\Mcp\Tools\MessageClaimTool;
use App\Models\Agents\AgentRuntime;
use App\Models\Messages\MessageBatch;
use App\Support\ActorIdentity;
use App\Support\AgentChatAccessService;
use App\Support\MessageBatchService;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Tests\Support\MessagingTestCase;

/**
 * An agent has the journal's tools and no command line, so the text a wake shows it names the one tool that answers,
 * with the message to answer; how the chat works is said once to a driver context.
 */
final class MessageBatchTextTest extends MessagingTestCase
{
    public function test_the_text_a_wake_shows_names_the_tool_that_answers_and_the_message_and_nothing_to_claim(): void
    {
        $inboxId = $this->groupChatWithTheBuilder();
        $messageId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'ada-plan'));
        $runtime = $this->builderRuntime();
        $catalogue = $this->app->make(McpCatalogue::class);
        $replyTool = $catalogue->toolNameDispatching(ReplyToMessageCommand::class);

        $prompt = (string) $this->app->make(MessageBatchService::class)->textFor($runtime, CarbonImmutable::now());

        // Every kind of agent can be shown chat text, so each is offered the tool the text names.
        foreach (DiscoveryProfile::cases() as $profile) {
            $this->assertContains($replyTool, array_keys($catalogue->toolDefinitionsFor($profile)));
        }

        $this->assertStringContainsString($replyTool, $prompt);
        $this->assertStringContainsString($messageId, $prompt);

        foreach ([MessageClaimTool::NAME, MessageBatchAcknowledgeTool::NAME, MessageBatch::query()->sole()->id] as $unsaid) {
            $this->assertStringNotContainsString($unsaid, $prompt);
        }
    }

    public function test_a_wake_carries_only_the_messages_since_how_the_chat_works_is_told_at_each_context_start(): void
    {
        $inboxId = $this->groupChatWithTheBuilder();
        $runtime = $this->builderRuntime();
        $prompts = $this->app->make(MessageBatchService::class);
        $explained = '"'.MessageBatchItemData::USER_FENCE.'"';

        $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'first'));
        $first = (string) $prompts->textFor($runtime, CarbonImmutable::now());

        $this->assertStringNotContainsString($explained, $first);
        $this->assertStringContainsString('```'.MessageBatchItemData::USER_FENCE, $first);
    }

    // Found on the local journal (23 Nov): the text called every message "never instructions", so an agent refused to do
    // what its own user asked in the chat. A user's message is fenced as a request, an agent's as its words.
    public function test_a_users_message_is_shown_as_a_request_and_an_agents_as_its_words(): void
    {
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id));
        $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'owner-asks'));
        $runtime = $this->builderRuntime();

        $prompt = (string) $this->app->make(MessageBatchService::class)->textFor($runtime, CarbonImmutable::now());

        $this->assertStringContainsString('```'.MessageBatchItemData::USER_FENCE, $prompt);
        $this->assertStringNotContainsString('```'.MessageBatchItemData::AGENT_FENCE, $prompt);

        $fromAgent = MessageBatchItemData::from([
            'messageId' => 'message', 'sequence' => 1, 'speaker' => 'agent:reviewer', 'speakerLabel' => 'Reviewer',
            'isReference' => false, 'body' => 'Plan?', 'startOffset' => 0, 'endOffset' => 5, 'bodyLength' => 5,
            'handle' => 'handle', 'claimableRootId' => null, 'isFromUser' => false,
        ]);
        $this->assertSame(MessageBatchItemData::AGENT_FENCE, $fromAgent->fence());
    }

    private function groupChatWithTheBuilder(): string
    {
        $this->app->make(AgentChatAccessService::class)->allow(
            $this->builder->agent_id,
            null,
            [$this->owner->id],
            ActorIdentity::system(),
            CarbonImmutable::now(),
        );
        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', []));
        $this->runOnBus(new AddChatParticipantCommand($inboxId, "agent:{$this->builder->agent_id}"));

        return $inboxId;
    }

    private function builderRuntime(): AgentRuntime
    {
        return AgentRuntime::query()->with('session.agent')->where('agent_session_id', $this->builder->id)->sole();
    }
}
