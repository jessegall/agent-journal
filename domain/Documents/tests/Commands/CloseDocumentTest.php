<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;

/**
 * A close turns a draft's saves into exactly one next revision; an unchanged draft adds none, and a repeated close
 * returns the first outcome.
 */
final class CloseDocumentTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    private const string RISKS_TEXT = <<<'TEXT'
        ## Risks
        Late.

        TEXT;

    private const string STEPS_TEXT = <<<'TEXT'
        ## Steps
        One.

        TEXT;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    private const string BODY = <<<'TEXT'
    # Goal
    Ship it.

    ## Steps
    One.

    ## Risks
    None.

    TEXT;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser(1);
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', self::BODY));
    }

    public function test_two_saves_close_into_exactly_one_next_revision(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));

        $draft = $this->bus()->run(new EditDocumentCommand($draft->target(), '3', self::RISKS_TEXT));

        $draft = $this->bus()->run(new ChangeDocumentDetailsCommand($draft->target(), 'Design', 'What we build next'));
        $closed = $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame(3, $draft->version);
        $this->assertSame([
            2,
            true,
        ], [
            $closed->revisionNumber,
            $closed->isPublished,
        ]);

        $this->assertStringContainsString(self::RISKS_TEXT, $this->documents()->show(1)->body);

        $this->assertStringContainsString(self::STEPS_TEXT, $this->documents()->show(1)->body);

        $this->assertSame(self::BODY, $this->documents()->revision(1, 1)->body);
        $this->assertTrue($this->documents()->revision(1, 1)->isHistorical);
        $this->assertCount(2, $this->documents()->revisions(1, 1));
        $this->assertSame(0, DocumentDraft::query()->count());
    }

    public function test_an_unchanged_draft_adds_no_revision_and_a_repeated_close_returns_the_first_outcome(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'One.', 'Two.'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Two.', 'One.'));
        $first = $this->bus()->run(new CloseDocumentCommand($draft->target()));
        $repeated = $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame([
            1,
            false,
        ], [
            $first->revisionNumber,
            $first->isPublished,
        ]);
        $this->assertEquals($first, $repeated);
        $this->assertSame(1, DocumentClose::query()->count());
        $this->assertSame('1', $this->documents()->show(1)->revision);
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
