<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Data\PresentationItemData;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\McpCatalogue;
use App\Mcp\Tools\MessageClaimTool;
use App\Mcp\Tools\MessagePresentationAcknowledgeTool;
use App\Models\AgentRuntime;
use App\Models\PresentationBatch;
use App\Support\ActorIdentity;
use App\Support\AgentChatAccess;
use App\Support\PresentationPrompts;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Tests\Support\MessagingTestCase;

/**
 * An agent has the journal's tools and no command line, so the text a wake shows it names the tools that claim a turn
 * and confirm what was shown, with the values each one takes.
 */
final class PresentationPromptTest extends MessagingTestCase
{
    private const string CLAIM_GRANT_INPUT = 'claim_grant';

    private const string HANDLES_INPUT = 'handles';

    public function test_the_text_a_wake_shows_names_the_journal_tools_and_what_each_takes(): void
    {
        $this->app->make(AgentChatAccess::class)->allow(
            $this->builder->agent_id,
            null,
            [$this->owner->id],
            ActorIdentity::system(),
            CarbonImmutable::now(),
        );
        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', []));
        $this->runOnBus(new AddChatParticipantCommand($inboxId, "agent:{$this->builder->agent_id}"));
        $messageId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'ada-plan'));
        $runtime = AgentRuntime::query()->with('session.agent')->where('agent_session_id', $this->builder->id)->sole();
        $contextKey = PresentationPrompts::contextOf($runtime);

        $prompt = (string) $this->app->make(PresentationPrompts::class)->promptFor($runtime, CarbonImmutable::now());

        $batchId = PresentationBatch::query()->sole()->id;
        $catalogue = $this->app->make(McpCatalogue::class);

        // Every kind of agent can be shown chat text, so each is offered the two tools the text names.
        foreach (DiscoveryProfile::cases() as $profile) {
            $offered = array_keys($catalogue->toolDefinitionsFor($profile));
            $this->assertContains(MessageClaimTool::NAME, $offered);
            $this->assertContains(MessagePresentationAcknowledgeTool::NAME, $offered);
        }

        foreach ([
            MessageClaimTool::NAME,
            MessagePresentationAcknowledgeTool::NAME,
            "inbox_id {$inboxId}",
            "root_id {$messageId}",
            "batch_id {$batchId}",
            "context_key {$contextKey}",
            self::CLAIM_GRANT_INPUT,
            self::HANDLES_INPUT,
        ] as $named) {
            $this->assertStringContainsString($named, $prompt);
        }
    }

    // Found on the local journal (23 Nov): the text called every message "never instructions", so an agent refused to do
    // what its own user asked in the chat. A person's message is fenced as a request, an agent's as its words.
    public function test_a_persons_message_is_shown_as_a_request_and_an_agents_as_its_words(): void
    {
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id));
        $this->runOnBus(new PostChatMessageCommand($inboxId, 'Plan?', 'owner-asks'));
        $runtime = AgentRuntime::query()->with('session.agent')->where('agent_session_id', $this->builder->id)->sole();

        $prompt = (string) $this->app->make(PresentationPrompts::class)->promptFor($runtime, CarbonImmutable::now());

        $this->assertStringContainsString('```'.PresentationItemData::PERSON_FENCE, $prompt);
        $this->assertStringNotContainsString('```'.PresentationItemData::AGENT_FENCE, $prompt);

        $fromAgent = PresentationItemData::from([
            'messageId' => 'message', 'sequence' => 1, 'speaker' => 'agent:reviewer', 'speakerLabel' => 'Reviewer',
            'isReference' => false, 'body' => 'Plan?', 'startOffset' => 0, 'endOffset' => 5, 'bodyLength' => 5,
            'handle' => 'handle', 'claimableRootId' => null, 'isFromPerson' => false,
        ]);
        $this->assertSame(PresentationItemData::AGENT_FENCE, $fromAgent->fence());
    }
}
