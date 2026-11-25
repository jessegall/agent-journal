<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Models\Document;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * An open starts a draft at version one and opening again returns the same draft; another user is refused naming
 * the holder, who cannot open a second document.
 */
final class OpenDocumentTest extends TestCase
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
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', self::BODY));
    }

    public function test_an_open_starts_at_version_one_and_opening_again_returns_the_same_draft(): void
    {
        $opened = $this->bus()->run(new OpenDocumentCommand('1'));
        $again = $this->bus()->run(new OpenDocumentCommand('1'));

        $this->assertSame([
            1,
            1,
        ], [
            $opened->version,
            $opened->baseRevisionNumber,
        ]);
        $this->assertSame($opened->token, $again->token);
        $this->assertSame([
            '1 Goal',
            '2 Steps',
            '3 Risks',
        ], $opened->outline);
    }

    public function test_another_user_is_refused_naming_the_holder_who_cannot_open_a_second_document(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Notes', 'What we saw', "Text\n"));
        $this->bus()->run(new OpenDocumentCommand('1'));

        try {
            $this->bus()->run(new OpenDocumentCommand('2'));
            $this->fail('A second draft for one editor was opened.');
        } catch (DraftHeld $held) {
            $this->assertSame(DraftHeld::elsewhere(1)->getMessage(), $held->getMessage());
        }

        $this->journal->actAsUserId(TestIds::of(2));
        $this->expectException(DraftHeld::class);
        $this->expectExceptionMessage(TestIds::of(1));
        $this->bus()->run(new OpenDocumentCommand('1'));
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
