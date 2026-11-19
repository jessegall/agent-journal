<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;
use App\Ui\Declarations\SlotContext;
use Carbon\CarbonImmutable;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\DockDocument;
use Domain\Documents\Commands\HideDocumentDock;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Data\DockData;
use Domain\Documents\Models\RecordDock;
use Domain\Documents\Readers\DocumentDockReader;
use Domain\Documents\Tests\TestCase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A record an agent creates docks as one card in its own session; cards are docked, hidden and shown again without
 * touching the record, and a settled record leaves the dock until a changed revision makes it active.
 */
final class DockTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus and the launches commit for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['record_docks', 'record_settlements', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups', 'links', 'hook_calls', 'agent_stacks', 'launch_credentials', 'agent_sessions', 'agents'];

    private AgentSession $builderSession;

    private AgentSession $reviewerSession;

    protected function setUp(): void
    {
        parent::setUp();

        $launch = $this->app->make(LaunchSessions::class);
        $this->builderSession = $launch->launch(Agent::named('Builder', AgentRole::MainAgent), TestSelections::of('claude-code'), TestSelections::requestId())->session;
        $this->reviewerSession = $launch->launch(Agent::named('Reviewer', AgentRole::MainAgent), TestSelections::of('claude-code'), TestSelections::requestId())->session;
    }

    public function test_an_agents_new_report_docks_once_in_its_own_session_and_a_users_creation_docks_nothing(): void
    {
        $this->actAsAgent($this->builderSession);
        $this->bus()->run(new CreateReport('Check', 'What we found', "All good\n"));

        $this->actAsUser();
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));

        $dock = $this->dockOf($this->builderSession);
        $this->assertSame([['report', '1']], array_map(fn ($card) => [$card->type, $card->number], $dock->cards));
        $this->assertSame([], $this->dockOf($this->reviewerSession)->cards);
    }

    public function test_docking_again_adds_no_card_hiding_keeps_the_record_and_docking_shows_it_again(): void
    {
        $this->actAsUser();
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));

        $this->bus()->run(new DockDocument(1, $this->builderSession->id));
        $this->bus()->run(new DockDocument(1, $this->builderSession->id));
        $this->assertSame(1, RecordDock::query()->count());

        $this->bus()->run(new HideDocumentDock(1, $this->builderSession->id));
        $this->assertSame([], $this->dockOf($this->builderSession)->cards);
        $this->assertCount(1, $this->dockOf($this->builderSession)->hidden);

        $this->bus()->run(new DockDocument(1, $this->builderSession->id));
        $this->assertCount(1, $this->dockOf($this->builderSession)->cards);
        $this->assertSame(1, RecordDock::query()->count());
    }

    public function test_an_agent_cannot_dock_into_another_agents_session(): void
    {
        $this->actAsUser();
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $this->actAsAgent($this->builderSession);

        $this->expectException(StackTargetRefused::class);

        $this->bus()->run(new DockDocument(1, $this->reviewerSession->id));
    }

    public function test_a_settled_document_leaves_the_dock_until_a_changed_revision_is_published(): void
    {
        $this->actAsUser();
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Ship it.\n"));
        $this->bus()->run(new DockDocument(1, $this->builderSession->id));
        $this->bus()->run(new SettleDocument(1, 1, 'Shipped.'));
        $this->assertSame([], $this->dockOf($this->builderSession)->cards);

        $draft = $this->bus()->run(new OpenDocument(1));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Ship it.', 'Ship it again.'));
        $this->bus()->run(new CloseDocument($this->target($draft)));

        $this->assertCount(1, $this->dockOf($this->builderSession)->cards);
    }

    private function dockOf(AgentSession $session): DockData
    {
        $this->actAsUser();

        return $this->app->make(DocumentDockReader::class)->read(SlotContext::session($session->id));
    }

    private function target(DraftReference $draft): DraftTarget
    {
        return new DraftTarget($draft->documentNumber, $draft->token, $draft->version);
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)));
    }

    private function actAsAgent(AgentSession $session): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($session->agent_id));
        $this->app->instance(AgentContext::class, new AgentContext($session->agent_id, $session->id, 'hooks.main_ready', new SignedCall(TestIds::of(501), CarbonImmutable::now(), str_repeat('0', 64)), null));
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
