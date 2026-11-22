<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Events\SessionClosed;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandAdmissionRefused;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Bus\Support\RequiredListenerRegistry;
use App\Domains\Support\AvailableListener;
use Carbon\CarbonImmutable;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\RecoverDocument\RecoverDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Data\DraftView;
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
use Illuminate\Support\Facades\DB;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;

/**
 * Records are settled with a reason and become active again when a changed revision is published; a user recovers
 * an abandoned draft, and a session that ends closes its agent's draft inside the ending transaction.
 */
final class SettleAndRecoverTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    private const string REASON_REQUIRED = 'reason: The reason field is required.';

    private const string SHIPPED_SOON = 'Ship it soon.';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'record_settlements',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser(1);

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
    }

    public function test_a_user_settles_a_document_with_a_reason_and_a_changed_revision_makes_it_active_again(): void
    {
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));

        $inspection = $this->documents()->inspect(1);
        $this->assertSame(AttentionState::Settled, $inspection->attention);
        $this->assertSame(['Shipped.'], array_map(fn ($settlement) => $settlement->reason, $inspection->settlements));

        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Ship it again.'));
        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame(AttentionState::Active, $this->documents()->inspect(1)->attention);
        $this->assertCount(1, $this->documents()->inspect(1)->settlements);
    }

    public function test_a_blank_reason_another_reason_and_an_open_draft_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->bus()->run(new SettleDocumentCommand(1, 1, '   ')),
            CommandInputInvalid::class,
            self::REASON_REQUIRED,
        );

        $this->assertSame(AttentionState::Active, Document::query()->sole()->attention);

        $this->bus()->run(new OpenDocumentCommand('1'));
        $this->expectException(SettlementDenied::class);
        $this->expectExceptionMessage(SettlementDenied::beingEdited(1)->getMessage());

        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Done.'));
    }

    public function test_a_reason_over_its_limit_is_refused_and_the_record_stays_unsettled(): void
    {
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $tooLong = str_repeat('a', Document::SETTLEMENT_REASON_CHARACTER_LIMIT + 1);

        $this->assertThrows(fn () => $this->bus()->run(new SettleDocumentCommand(1, 1, $tooLong)), CommandInputInvalid::class);
        $this->assertThrows(fn () => $this->bus()->run(new CloseReportCommand('1', $tooLong)), CommandInputInvalid::class);

        $this->assertSame(
            [AttentionState::Active, AttentionState::Active],
            [Document::query()->sole()->attention, Report::query()->sole()->attention],
        );
    }

    public function test_a_reason_is_stored_trimmed_and_the_same_reason_again_changes_nothing(): void
    {
        $this->bus()->run(new SettleDocumentCommand(1, 1, '  Shipped.  '));
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));

        $settlements = $this->documents()->inspect(1)->settlements;

        $this->assertSame(['Shipped.'], array_map(fn ($settlement) => $settlement->reason, $settlements));
    }

    public function test_a_blank_recovery_reason_is_refused_and_the_draft_stays_held(): void
    {
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->actAsUser(1);

        $this->assertThrows(
            fn () => $this->bus()->run(new RecoverDocumentCommand($draft->target(), ' ')),
            CommandInputInvalid::class,
            'reason:',
        );

        $this->assertSame(1, DocumentDraft::query()->count());
    }

    public function test_an_agent_settles_only_the_reports_it_created(): void
    {
        $this->actAsAgent(9, 90);
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $this->bus()->run(new CloseReportCommand('1', 'Checked.'));
        $this->assertSame(AttentionState::Settled, Report::query()->sole()->attention);

        $this->actAsUser(1);
        $this->bus()->run(new CreateReportCommand('Other', 'By a user', "Text\n"));
        $this->actAsAgent(8, 80);
        $this->expectException(ActorNotAllowed::class);

        $this->bus()->run(new CloseReportCommand('2', 'Not mine.'));
    }

    public function test_a_user_recovers_an_agents_draft_and_the_revision_keeps_the_agent_as_author(): void
    {
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', self::SHIPPED_SOON));

        $this->actAsUser(1);
        $editing = $this->documents()->inspect(1)->editing;
        $this->assertInstanceOf(DraftView::class, $editing->held);
        $this->assertSame(self::SHIPPED_SOON, trim(substr($editing->held->body, -14)));

        try {
            $this->bus()->run(new RecoverDocumentCommand(new DraftTarget('1', $draft->token, 1), 'Agent gone.'));
            $this->fail('A recovery on an old version was accepted.');
        } catch (DraftConflict) {
            $this->assertSame(1, DocumentDraft::query()->count());
        }

        $result = $this->bus()->run(new RecoverDocumentCommand($draft->target(), '  Agent gone.  '));
        $close = DocumentClose::query()->sole();

        $this->assertSame([2, true], [$result->revisionNumber, $result->published]);
        $this->assertSame(TestIds::of(9), $this->documents()->revisions(1, 1)[1]->authorId);

        $this->assertSame(
            [CloseCause::Recovery, TestIds::of(1), 'Agent gone.'],
            [$close->cause, $close->closer_id, $close->reason],
        );

        $this->assertSame(1, $this->bus()->run(new OpenDocumentCommand('1'))->version);
    }

    public function test_an_agent_cannot_recover_a_draft(): void
    {
        $this->actAsAgent(9, 90);
        $this->expectException(CommandAdmissionRefused::class);

        $this->bus()->run(new RecoverDocumentCommand(new DraftTarget('1', 'any', 1), 'Mine now.'));
    }

    public function test_an_ended_session_closes_a_changed_draft_into_a_revision_and_an_unchanged_one_into_none(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Notes', 'What we saw', "Text\n"));
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Shipped.'));
        $this->actAsAgent(8, 80);
        $this->bus()->run(new OpenDocumentCommand('2'));

        DB::transaction(fn () => $this->endSession(9, 90));
        DB::transaction(fn () => $this->endSession(8, 80));

        $this->assertSame(0, DocumentDraft::query()->count());
        $this->assertSame(['2', '1'], [$this->documents()->show(1)->revision, $this->documents()->show(2)->revision]);

        $this->assertSame(
            [CloseCause::Lifecycle, CloseCause::Lifecycle],
            DocumentClose::query()->orderBy('closed_at')->get()->pluck('cause')->all(),
        );
    }

    public function test_a_failing_close_rolls_the_session_ending_back_and_keeps_the_draft(): void
    {
        $this->actAsAgent(9, 90);
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Shipped.'));

        $this->assertThrows(
            fn () => DB::transaction(function (): void {
                $this->endSession(9, 90);

                throw SimulatedFailure::of('The ending failed.');
            }),
            SimulatedFailure::class,
        );

        $this->assertSame(1, DocumentDraft::query()->count());
        $this->assertSame(0, DocumentClose::query()->count());
    }

    public function test_the_documents_listener_hears_a_session_ending_behind_its_domain_gate(): void
    {
        $listeners = array_map(
            fn ($listener) => $listener instanceof AvailableListener ? $listener->listener : '',
            $this->app->make(RequiredListenerRegistry::class)->listenersOf(SessionClosed::class),
        );

        $this->assertContains(CloseEndedSessionDraft::class.'@handle', $listeners);
    }

    private function endSession(int $agent, int $session): void
    {
        $this->app->make(CloseEndedSessionDraft::class)
            ->handle(new SessionClosed(TestIds::of($agent), TestIds::of($session)));
    }

    private function actAsAgent(int $agent, int $session): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of($agent)),
            TestStartAuthority::forAgent(TestIds::of($agent)),
        );

        $call = new SignedCall(TestIds::of(500 + $agent), CarbonImmutable::now(), str_repeat('0', 64));
        $context = new AgentContext(TestIds::of($agent), TestIds::of($session), $call, null);
        $this->app->instance(AgentContext::class, $context);
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
