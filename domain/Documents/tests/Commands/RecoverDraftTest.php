<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Data\Messages\MessageTextData;
use App\Enums\Drivers\DriverOperation;
use App\Events\Sessions\SessionClosed;
use App\Models\Drivers\DriverRequest;
use App\Support\AgentSessions;
use App\Support\StackTransaction;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\RecoverDraft\RecoverDraftCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftReader;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Listeners\CloseEndedSessionDraft;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Tests\Support\GrantsDraftReads;
use Domain\Documents\Tests\TestCase;
use Domain\Documents\Values\DraftTarget;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

#[TestsCommand(RecoverDraftCommand::class)]
final class RecoverDraftTest extends TestCase
{
    use CommitsHookRows;
    use GrantsDraftReads;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'session_policies',
        'links',
        'command_receipts',
        'documents',
        'document_revisions',
        'document_drafts',
        'document_closes',
        'retained_drafts',
        'number_groups',
        'agent_runtimes',
        'driver_requests',
        'assignments',
    ];

    public function test_a_broken_draft_is_kept_and_only_its_granted_parent_can_recover_it(): void
    {
        $parent = $this->journal->signedStart('Test agent');
        $this->journal->syntheticRuntime($parent->session);
        $other = $this->journal->signedStart('Test agent 2');
        $child = $this->journal->idleAgent('Document editor', 'writing-helper')->agentCalled('Document editor');

        $session = $this->app->make(AgentSessions::class)->start(
            $child,
            TestSelections::of(),
            TestSelections::requestId(),
            $parent->session,
        );

        $this->journal->actAsAgentIds($child->id, $session->id);
        $bus = $this->app->make(CommandBus::class);

        $created = $bus->run(new CreateDocumentCommand(
            'Design',
            'Current plan.',
            "# Design\nPublished text.",
            TestProjects::local()->id,
        ));

        $opened = $bus->run(new OpenDocumentCommand($created->id, 1));
        $badText = "| Missing | Dashes |\n| A | B |";

        $bus->run(
            new EditDocumentCommand(new DraftTarget($created->id, $opened->token, $opened->version), '1', $badText),
        );

        $closed = new SessionClosed($child->id, $session->id);
        $listener = $this->app->make(CloseEndedSessionDraft::class);
        $stack = $this->app->make(StackTransaction::class);
        $stack->run(fn () => $listener->handle($closed));
        $stack->run(fn () => $listener->handle($closed));
        $kept = RetainedDraft::query()->sole();
        $this->assertSame(0, DocumentDraft::query()->count());
        $this->assertSame('1', $this->app->make(DocumentResolver::class)->show($created->number)->revision);
        $notice = DriverRequest::query()->where('operation', DriverOperation::Deliver)->sole()->parts[0];
        $this->assertInstanceOf(MessageTextData::class, $notice);
        $this->assertStringContainsString($kept->id, $notice->text);
        $this->assertStringNotContainsString($badText, $notice->text);

        $other->startRequest($this->app);
        $this->assertThrows(fn () => $this->app->make(DraftReader::class)->draft($kept->id), DraftMissing::class);
        $parent->startRequest($this->app);
        $this->assertThrows(fn () => $this->app->make(DraftReader::class)->draft($kept->id), DraftMissing::class);

        $this->grantDraftReads($parent, $created->id);
        $this->assertStringContainsString($badText, $this->app->make(DraftReader::class)->draft($kept->id)->body);
        $this->assertThrows(fn () => $bus->run(new RecoverDraftCommand($kept->id, 99)), StaleRead::class);
        $recovered = $bus->run(new RecoverDraftCommand($kept->id, 1));
        $this->assertNotSame($opened->token, $recovered->token);
        $this->assertStringContainsString($badText, $this->app->make(DraftResolver::class)->current(1)->body);
        $this->assertSame('1', $this->app->make(DocumentResolver::class)->show($created->number)->revision);
    }
}
