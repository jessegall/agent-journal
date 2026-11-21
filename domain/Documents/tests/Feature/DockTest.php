<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;
use App\Ui\Declarations\SlotContext;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Data\DockData;
use Domain\Documents\Resolvers\DocumentDockResolver;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;

/**
 * Creating a document or report docks nothing; Documents only suggests its newest records for Chat's dock.
 */
final class DockTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus and the starts commit for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'record_settlements',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'links',
        'hook_calls',
        'agent_stacks',
        'start_tokens',
        'agent_sessions',
        'agents',
    ];

    private AgentSession $builderSession;

    private AgentSession $reviewerSession;

    protected function setUp(): void
    {
        parent::setUp();

        $start = $this->app->make(StartSessions::class);

        $this->builderSession = $start->start(
            Agent::create('Builder', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;

        $this->reviewerSession = $start->start(
            Agent::create('Reviewer', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
    }

    public function test_creating_a_document_or_report_docks_nothing_and_the_section_only_suggests_them(): void
    {
        $this->actAsAgent($this->builderSession);
        $this->bus()->run(new CreateReport('Check', 'What we found', "All good\n"));

        $this->actAsUser();
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));

        $this->assertFalse(Schema::hasTable('record_docks'));

        $this->assertEqualsCanonicalizing(
            [['report', '1'], ['doc', '1']],
            array_map(fn ($card) => [$card->type, $card->number], $this->dockOf($this->builderSession)->suggestions),
        );
    }

    private function dockOf(AgentSession $session): DockData
    {
        $this->actAsUser();

        return $this->app->make(DocumentDockResolver::class)->read(SlotContext::session($session->id));
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function actAsAgent(AgentSession $session): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($session->agent_id),
            TestStartAuthority::forAgent($session->agent_id),
        );

        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                $session->agent_id,
                $session->id,
                new SignedCall(TestIds::of(501), CarbonImmutable::now(), str_repeat('0', 64)),
                null,
            ),
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
