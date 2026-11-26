<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;

/**
 * A title over its limit is refused and the draft keeps its text.
 */
#[TestsCommand(ChangeDocumentDetailsCommand::class)]
final class ChangeDocumentDetailsTest extends TestCase
{
    use CommitsHookRows;

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

        $this->journal->actAsUserId(TestIds::of(1));
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', self::BODY, TestProjects::local()->id));
    }

    public function test_a_title_over_its_limit_is_refused_and_the_draft_keeps_its_text(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));

        $tooLong = new ChangeDocumentDetailsCommand(
            $draft->target(),
            str_repeat('a', Document::TITLE_CHARACTER_LIMIT + 1),
            'What we build',
        );

        $this->assertThrows(fn () => $this->bus()->run($tooLong), CommandInputInvalid::class, 'title:');

        $this->assertSame([
            1,
            'Design',
        ], [
            DocumentDraft::query()->sole()->version,
            DocumentDraft::query()->sole()->title,
        ]);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
