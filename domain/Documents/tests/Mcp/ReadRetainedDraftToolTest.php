<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use App\Events\Sessions\SessionClosed;
use App\Support\AgentSessions;
use App\Support\StackTransaction;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Listeners\CloseEndedSessionDraft;
use Domain\Documents\Mcp\Tools\ReadRetainedDraftTool;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Tests\Support\GrantsDraftReads;
use Domain\Documents\Values\DraftTarget;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A parent agent reads the draft its helper's session left broken when it closed, which the journal kept.
 */
#[TestsMcpTool(ReadRetainedDraftTool::class)]
final class ReadRetainedDraftToolTest extends McpToolEntryTestCase
{
    use GrantsDraftReads;

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $parent = $journal->owner()->signedStart('Writer');
        $journal->syntheticRuntime($parent->session);
        $helper = $journal->idleAgent('Document editor', 'writing-helper')->agentCalled('Document editor');

        $session = $this->app->make(AgentSessions::class)->start(
            $helper,
            TestSelections::of(),
            TestSelections::requestId(),
            $parent->session,
        );

        $journal->actAsAgentIds($helper->id, $session->id);
        $document = $journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));
        $opened = $journal->run(new OpenDocumentCommand($document->id, 1));

        $journal->run(new EditDocumentCommand(
            new DraftTarget($document->id, $opened->token, $opened->version),
            '1',
            "| Missing | Dashes |\n| A | B |",
        ));

        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(CloseEndedSessionDraft::class)->handle(new SessionClosed($helper->id, $session->id)),
        );

        $this->grantDraftReads($parent, $document->id);

        return ToolCall::by($parent)->arguments(['draft_id' => RetainedDraft::query()->sole()->id]);
    }
}
