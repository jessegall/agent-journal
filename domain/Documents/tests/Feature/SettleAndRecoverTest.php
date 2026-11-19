<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Events\LaunchEnded;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\AvailableListener;
use App\Text\Exceptions\ContentMissing;
use Carbon\CarbonImmutable;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\RecoverDocument;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Commands\SettleReport;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Listeners\CloseEndedSessionDraft;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestLaunchAuthority;

/**
 * Records are settled with a reason and become active again when a changed revision is published; a user recovers
 * an abandoned draft, and a session that ends closes its agent's draft inside the ending transaction.
 */
final class SettleAndRecoverTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['record_settlements', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser(1);
        $this->bus()->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
    }

    public function test_a_user_settles_a_document_with_a_reason_and_a_changed_revision_makes_it_active_again(): void
    {
        $this->bus()->run(new SettleDocument(1, 1, 'Shipped.'));
        $this->bus()->run(new SettleDocument(1, 1, 'Shipped.'));

        $inspection = $this->documents()->inspect(1);
        $this->assertSame(AttentionState::Settled, $inspection->attention);
        $this->assertSame(['Shipped.'], array_map(fn ($settlement) => $settlement->reason, $inspection->settlements));

        $draft = $this->bus()->run(new OpenDocument(1));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Ship it.', 'Ship it again.'));
        $this->bus()->run(new CloseDocument($this->target($draft)));

        $this->assertSame(AttentionState::Active, $this->documents()->inspect(1)->attention);
        $this->assertCount(1, $this->documents()->inspect(1)->settlements);
    }

    public function test_a_blank_reason_another_reason_and_an_open_draft_are_refused(): void
    {
        try {
            $this->bus()->run(new SettleDocument(1, 1, '   '));
            $this->fail('A blank reason was accepted.');
        } catch (ContentMissing) {
            $this->assertSame(AttentionState::Active, Document::query()->sole()->attention);
        }

        $this->bus()->run(new OpenDocument(1));
        $this->expectException(SettlementDenied::class);
        $this->expectExceptionMessage('close it before settling');

        $this->bus()->run(new SettleDocument(1, 1, 'Done.'));
    }

    public function test_an_agent_settles_only_the_reports_it_created(): void
    {
        $this->actAsAgent(9, 90);
        $this->bus()->run(new CreateReport('Check', 'What we found', "All good\n"));
        $this->bus()->run(new SettleReport(1, 'Checked.'));
        $this->assertSame(AttentionState::Settled, Report::query()->sole()->attention);

        $this->actAsUser(1);
        $this->bus()->run(new CreateReport('Other', 'By a user', "Text\n"));
        $this->actAsAgent(8, 80);
        $this->expectException(ActorNotAllowed::class);

        $this->bus()->run(new SettleReport(2, 'Not mine.'));
    }

    public function test_a_user_recovers_an_agents_draft_and_the_revision_keeps_the_agent_as_author(): void
    {
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocument(1));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Ship it.', 'Ship it soon.'));

        $this->actAsUser(1);
        $this->assertSame('Ship it soon.', trim(substr((string) $this->documents()->inspect(1)->editing->held->body, -14)));

        try {
            $this->bus()->run(new RecoverDocument(new DraftTarget(1, $draft->token, 1), 'Agent gone.'));
            $this->fail('A recovery on an old version was accepted.');
        } catch (DraftConflict) {
            $this->assertSame(1, DocumentDraft::query()->count());
        }

        $result = $this->bus()->run(new RecoverDocument($this->target($draft), 'Agent gone.'));
        $close = DocumentClose::query()->sole();

        $this->assertSame([2, true], [$result->revisionNumber, $result->published]);
        $this->assertSame(TestIds::of(9), $this->documents()->revisions(1, 1)[1]->authorId);
        $this->assertSame([CloseCause::Recovery, TestIds::of(1), 'Agent gone.'], [$close->cause, $close->closer_id, $close->reason]);
        $this->assertSame(1, $this->bus()->run(new OpenDocument(1))->version);
    }

    public function test_an_agent_cannot_recover_a_draft(): void
    {
        $this->actAsAgent(9, 90);
        $this->expectException(ActorNotAllowed::class);

        $this->bus()->run(new RecoverDocument(new DraftTarget(1, 'any', 1), 'Mine now.'));
    }

    public function test_an_ended_session_closes_its_changed_draft_into_a_revision_and_an_unchanged_one_into_none(): void
    {
        $this->bus()->run(new CreateDocument('Notes', 'What we saw', "Text\n"));
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocument(1));
        $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Ship it.', 'Shipped.'));
        $this->actAsAgent(8, 80);
        $this->bus()->run(new OpenDocument(2));

        DB::transaction(fn () => $this->endSession(9, 90));
        DB::transaction(fn () => $this->endSession(8, 80));

        $this->assertSame(0, DocumentDraft::query()->count());
        $this->assertSame(['2', '1'], [$this->documents()->show(1)->revision, $this->documents()->show(2)->revision]);
        $this->assertSame([CloseCause::Lifecycle, CloseCause::Lifecycle], DocumentClose::query()->orderBy('closed_at')->get()->pluck('cause')->all());
    }

    public function test_a_failing_close_rolls_the_session_ending_back_and_keeps_the_draft(): void
    {
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocument(1));
        $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Ship it.', 'Shipped.'));

        try {
            DB::transaction(function (): void {
                $this->endSession(9, 90);

                throw new RuntimeException('The ending failed.');
            });
            $this->fail('The ending did not fail.');
        } catch (RuntimeException) {
            $this->assertSame(1, DocumentDraft::query()->count());
            $this->assertSame(0, DocumentClose::query()->count());
        }
    }

    public function test_the_documents_listener_hears_a_session_ending_behind_its_domain_gate(): void
    {
        $listeners = array_map(fn ($listener) => $listener instanceof AvailableListener ? $listener->listener : '', $this->app->make(Dispatcher::class)->getRawListeners()[LaunchEnded::class] ?? []);

        $this->assertContains(CloseEndedSessionDraft::class.'@handle', $listeners);
    }

    private function endSession(int $agent, int $session): void
    {
        $this->app->make(CloseEndedSessionDraft::class)->handle(new LaunchEnded(TestIds::of($agent), TestIds::of($session)));
    }

    private function target(DraftReference $draft): DraftTarget
    {
        return new DraftTarget($draft->documentNumber, $draft->token, $draft->version);
    }

    private function actAsUser(int $user): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of($user)), new OwnerAuthority('test'));
    }

    private function actAsAgent(int $agent, int $session): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(TestIds::of($agent)), TestLaunchAuthority::forAgent(TestIds::of($agent)));
        $this->app->instance(AgentContext::class, new AgentContext(TestIds::of($agent), TestIds::of($session), new SignedCall(TestIds::of(500 + $agent), CarbonImmutable::now(), str_repeat('0', 64)), null));
    }

    private function documents(): DocumentResolver
    {
        return $this->app->make(DocumentResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
