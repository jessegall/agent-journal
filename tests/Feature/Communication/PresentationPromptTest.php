<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Contracts\Domains\JournalToolNames;
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
        $tools = $this->app->make(JournalToolNames::class)->toolNames();
        $this->assertContains(MessageClaimTool::NAME, $tools);
        $this->assertContains(MessagePresentationAcknowledgeTool::NAME, $tools);

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
}
