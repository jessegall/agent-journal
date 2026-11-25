<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The writer of an open draft replaces its whole body; a save on a version older than the draft's is refused and the
 * first save stands.
 */
final class ReplaceDocumentBodyTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['document_closes', 'document_drafts', 'document_revisions', 'documents', 'number_groups'];

    public function test_the_body_is_replaced_and_a_save_on_an_older_version_is_refused(): void
    {
        $this->journal->owner();
        $this->journal->run(new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"));
        $opened = $this->journal->run(new OpenDocumentCommand('1'));

        $this->journal->run(new ReplaceDocumentBodyCommand($opened->target(), "# Goal\nShip it twice.\n"));

        $this->assertThrows(
            fn () => $this->journal->run(new ReplaceDocumentBodyCommand($opened->target(), "# Goal\nStale.\n")),
            DraftConflict::class,
        );
        $this->assertStringContainsString('Ship it twice.', DocumentDraft::query()->sole()->body);
    }
}
