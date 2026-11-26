<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandAdmissionRefused;
use App\Exceptions\CommandInputInvalid;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\RecoverDocument\RecoverDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Domain\Documents\Values\DraftTarget;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;

/**
 * A user recovers an agent's draft and the revision keeps the agent as author; a blank reason is refused and the
 * draft stays held, and an agent cannot recover a draft.
 */
#[TestsCommand(RecoverDocumentCommand::class)]
final class RecoverDocumentTest extends TestCase
{
    use CommitsHookRows;

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

        $this->journal->placeBareAgentsInLocalProject();

        $this->journal->actAsUserId(TestIds::of(1));

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT, TestProjects::local()->id));
    }

    public function test_a_blank_recovery_reason_is_refused_and_the_draft_stays_held(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->journal->actAsUserId(TestIds::of(1));

        $this->assertThrows(
            fn () => $this->bus()->run(new RecoverDocumentCommand($draft->target(), ' ')),
            CommandInputInvalid::class,
            'reason:',
        );

        $this->assertSame(1, DocumentDraft::query()->count());
    }

    public function test_a_user_recovers_an_agents_draft_and_the_revision_keeps_the_agent_as_author(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', self::SHIPPED_SOON));

        $this->journal->actAsUserId(TestIds::of(1));
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

        $this->assertSame([
            2,
            true,
        ], [
            $result->revisionNumber,
            $result->isPublished,
        ]);

        $this->assertSame(TestIds::of(9), $this->documents()->revisions(1, 1)[1]->authorId);

        $this->assertSame(
            [
                CloseCause::Recovery,
                TestIds::of(1),
                'Agent gone.',
            ],
            [
                $close->cause,
                $close->closer_id,
                $close->reason,
            ],
        );

        $this->assertSame(1, $this->bus()->run(new OpenDocumentCommand('1'))->version);
    }

    public function test_an_agent_cannot_recover_a_draft(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $this->expectException(CommandAdmissionRefused::class);

        $this->bus()->run(new RecoverDocumentCommand(new DraftTarget('1', 'any', 1), 'Mine now.'));
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
