<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Enums\Engine\ListenerLane;
use App\Events\Sessions\SessionClosed;
use App\Support\AvailableListener;
use App\Support\ListenerRegistry;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Listeners\CloseEndedSessionDraft;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\TestIds;

/**
 * An ended session closes a changed draft into a revision and an unchanged one into none; a failing close rolls
 * the ending back and keeps the draft, and the documents listener hears an ending only behind its domain gate.
 */
final class DraftSessionEndingTest extends TestCase
{
    use CommitsHookRows;

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

        $this->journal->actAsUserId(TestIds::of(1));

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
    }

    public function test_an_ended_session_closes_a_changed_draft_into_a_revision_and_an_unchanged_one_into_none(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Notes', 'What we saw', "Text\n"));
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Shipped.'));
        $this->journal->actAsAgentIds(TestIds::of(8), TestIds::of(80));
        $this->bus()->run(new OpenDocumentCommand('2'));

        DB::transaction(fn () => $this->endSession(9, 90));
        DB::transaction(fn () => $this->endSession(8, 80));

        $this->assertSame(0, DocumentDraft::query()->count());
        $this->assertSame([
            '2',
            '1',
        ], [
            $this->documents()->show(1)->revision,
            $this->documents()->show(2)->revision,
        ]);

        $this->assertSame(
            [
                CloseCause::Lifecycle,
                CloseCause::Lifecycle,
            ],
            DocumentClose::query()->orderBy('closed_at')->get()->pluck('cause')->all(),
        );
    }

    public function test_a_failing_close_rolls_the_session_ending_back_and_keeps_the_draft(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
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
            $this->app->make(ListenerRegistry::class)->listenersOf(
                SessionClosed::class,
                ListenerLane::InCommandTransaction,
            ),
        );

        $this->assertContains(CloseEndedSessionDraft::class.'@handle', $listeners);
    }

    private function endSession(int $agent, int $session): void
    {
        $this->app->make(CloseEndedSessionDraft::class)
            ->handle(new SessionClosed(TestIds::of($agent), TestIds::of($session)));
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
