<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Events\Sessions\SessionClosed;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Models\Sessions\SessionPolicy;
use App\Support\ActorIdentity;
use App\Support\AgentSessions;
use App\Support\DeskService;
use App\Support\StackTransaction;
use App\Values\AccessPolicy;
use App\Values\OperationGrant;
use App\Values\ResourceRequest;
use App\Values\StartPolicy;
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
use Domain\Documents\Tests\TestCase;
use Domain\Documents\Values\DraftTarget;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

final class DocumentDraftTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WritesInboxMessages;

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
        'messages',
        'assignments',
    ];

    public function test_a_broken_draft_is_kept_and_only_its_granted_parent_can_recover_it(): void
    {
        $parent = TestStart::start();
        $other = TestStart::start();
        $child = Agent::create('Document editor', 'writing-helper');

        $session = $this->app->make(AgentSessions::class)->start(
            $child,
            TestSelections::of(),
            TestSelections::requestId(),
            $parent->session,
        );

        $this->app->make(DeskService::class)->installSourceDesk('system', 'System');
        $inbox = $this->inboxOf(ActorIdentity::of($parent->agent));

        $this->startRequestAs($child->id, $session->id);
        $bus = $this->app->make(CommandBus::class);
        $created = $bus->run(new CreateDocumentCommand('Design', 'Current plan.', "# Design\nPublished text."));
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
        $notice = Message::query()->acrossInboxes()->where('destination_inbox_id', $inbox->inboxId())->sole();
        $this->assertStringContainsString($kept->id, $notice->body);
        $this->assertStringNotContainsString($badText, $notice->body);

        $other->startRequest($this->app);
        $this->assertThrows(fn () => $this->app->make(DraftReader::class)->draft($kept->id), DraftMissing::class);
        $parent->startRequest($this->app);
        $this->assertThrows(fn () => $this->app->make(DraftReader::class)->draft($kept->id), DraftMissing::class);

        $this->grantSource($parent, $created->id);
        $this->assertStringContainsString($badText, $this->app->make(DraftReader::class)->draft($kept->id)->body);
        $this->assertThrows(fn () => $bus->run(new RecoverDraftCommand($kept->id, 99)), StaleRead::class);
        $recovered = $bus->run(new RecoverDraftCommand($kept->id, 1));
        $this->assertNotSame($opened->token, $recovered->token);
        $this->assertStringContainsString($badText, $this->app->make(DraftResolver::class)->current(1)->body);
        $this->assertSame('1', $this->app->make(DocumentResolver::class)->show($created->number)->revision);
    }

    private function grantSource(TestStart $parent, string $documentId): void
    {
        $start = StartPolicy::mainOnHost(base_path());
        $source = ResourceRequest::record('documents.document:'.$documentId);
        $grant = new OperationGrant('docs_drafts_read', [$source]);
        $access = new AccessPolicy([], [], $start->access->processes, [$grant]);

        SessionPolicy::create($parent->session, new StartPolicy(
            $access,
            $start->stopConditions,
            $start->execution,
            null,
            null,
            null,
        ));
    }
}
