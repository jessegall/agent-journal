<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Text\Exceptions\SectionMissing;
use App\Text\Exceptions\TextMatchInvalid;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\ReplaceDocumentSection;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A document is edited in one draft at a time: opened from its current revision, saved at counted versions, and closed
 * into one next revision only when its text changed.
 */
final class DraftsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    private const string BODY = "# Goal\nShip it.\n\n## Steps\nOne.\n\n## Risks\nNone.\n";

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser(1);
        $this->bus()->run(new CreateDocument('Design', 'What we build', self::BODY));
    }

    public function test_an_open_starts_at_version_one_and_opening_again_returns_the_same_draft(): void
    {
        $opened = $this->bus()->run(new OpenDocument(1));
        $again = $this->bus()->run(new OpenDocument(1));

        $this->assertSame([1, 1], [$opened->version, $opened->baseRevisionNumber]);
        $this->assertSame($opened->token, $again->token);
        $this->assertSame(['1 Goal', '2 Steps', '3 Risks'], $opened->outline);
    }

    public function test_two_saves_close_into_exactly_one_next_revision(): void
    {
        $draft = $this->bus()->run(new OpenDocument(1));
        $draft = $this->bus()->run(new ReplaceDocumentSection($this->target($draft), '3', "## Risks\nLate.\n"));
        $draft = $this->bus()->run(new ChangeDocumentDetails($this->target($draft), 'Design', 'What we build next'));
        $closed = $this->bus()->run(new CloseDocument($this->target($draft)));

        $this->assertSame(3, $draft->version);
        $this->assertSame([2, true], [$closed->revisionNumber, $closed->published]);
        $this->assertStringContainsString("## Risks\nLate.\n", $this->documents()->show(1)->body);
        $this->assertStringContainsString("## Steps\nOne.\n", $this->documents()->show(1)->body);
        $this->assertSame(self::BODY, $this->documents()->revision(1, 1)->body);
        $this->assertTrue($this->documents()->revision(1, 1)->historical);
        $this->assertCount(2, $this->documents()->revisions(1, 1));
        $this->assertSame(0, DocumentDraft::query()->count());
    }

    public function test_closing_an_unchanged_draft_adds_no_revision_and_a_repeated_close_returns_the_first_outcome(): void
    {
        $draft = $this->bus()->run(new OpenDocument(1));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'One.', 'Two.'));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Two.', 'One.'));
        $first = $this->bus()->run(new CloseDocument($this->target($draft)));
        $repeated = $this->bus()->run(new CloseDocument($this->target($draft)));

        $this->assertSame([1, false], [$first->revisionNumber, $first->published]);
        $this->assertEquals($first, $repeated);
        $this->assertSame(1, DocumentClose::query()->count());
        $this->assertSame('1', $this->documents()->show(1)->revision);
    }

    public function test_another_user_is_refused_with_the_holder_named_and_the_holder_cannot_open_a_second_document(): void
    {
        $this->bus()->run(new CreateDocument('Notes', 'What we saw', "Text\n"));
        $this->bus()->run(new OpenDocument(1));

        try {
            $this->bus()->run(new OpenDocument(2));
            $this->fail('A second draft for one editor was opened.');
        } catch (DraftHeld $held) {
            $this->assertStringContainsString('doc 1', $held->getMessage());
        }

        $this->actAsUser(2);
        $this->expectException(DraftHeld::class);
        $this->expectExceptionMessage(TestIds::of(1));
        $this->bus()->run(new OpenDocument(1));
    }

    public function test_a_save_on_an_old_version_is_refused_and_the_first_save_stands(): void
    {
        $opened = $this->bus()->run(new OpenDocument(1));
        $this->bus()->run(new ReplaceDocumentText($this->target($opened), 'One.', 'Two.'));

        try {
            $this->bus()->run(new ReplaceDocumentText($this->target($opened), 'One.', 'Three.'));
            $this->fail('A save on an old version was accepted.');
        } catch (DraftConflict) {
            $this->assertStringContainsString('Two.', DocumentDraft::query()->sole()->body);
        }
    }

    public function test_refused_edits_name_their_cause_and_change_nothing(): void
    {
        $draft = $this->bus()->run(new OpenDocument(1));
        $refusals = [
            [new ReplaceDocumentText($this->target($draft), '.', '!'), TextMatchInvalid::class],
            [new ReplaceDocumentSection($this->target($draft), 'Missing', "## Missing\nText.\n"), SectionMissing::class],
        ];

        foreach ($refusals as [$command, $refusal]) {
            try {
                $this->bus()->run($command);
                $this->fail('A refused edit was accepted.');
            } catch (TextMatchInvalid|SectionMissing $refused) {
                $this->assertInstanceOf($refusal, $refused);
            }
        }

        $this->assertSame(1, DocumentDraft::query()->sole()->version);
    }

    public function test_an_edit_without_an_open_draft_names_doc_open(): void
    {
        $this->expectException(DraftMissing::class);
        $this->expectExceptionMessage('doc:open 1');

        $this->bus()->run(new ReplaceDocumentText(new DraftTarget(1, 'unknown', 1), 'One.', 'Two.'));
    }

    private function target(DraftReference $draft): DraftTarget
    {
        return new DraftTarget($draft->documentNumber, $draft->token, $draft->version);
    }

    private function actAsUser(int $user): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of($user)));
    }

    private function documents(): DocumentReader
    {
        return $this->app->make(DocumentReader::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
