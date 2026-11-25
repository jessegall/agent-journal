<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\SectionMissing;
use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\DraftMarkdownInvalid;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Tests\TestCase;
use Domain\Documents\Values\DraftTarget;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedPayloads;

final class EditDocumentTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedPayloads;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'command_receipts',
        'links',
        'documents',
        'document_revisions',
        'document_drafts',
        'document_closes',
        'number_groups',
        'text_uploads',
        'text_upload_chunks',
        'comments',
    ];

    public function test_a_designer_can_publish_a_section_from_a_sealed_upload(): void
    {
        $designer = TestStart::start('writing-helper');
        $designer->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $created = $bus->run(new CreateDocumentCommand('Design', 'The next design.', "# Design\nOld text.\n"));
        $draft = $bus->run(new OpenDocumentCommand($created->id, 1));
        $target = new DraftTarget($created->id, $draft->token, 1);
        $replacement = str_repeat('a', 1024 * 1024);

        $id = $bus->run(new BeginUploadCommand(
            UploadType::EditReplacement,
            strlen($replacement),
            hash('sha256', $replacement),
        ));

        foreach (str_split($replacement, TextUpload::CHUNK_BYTES) as $index => $chunk) {
            $bus->run(new AppendUploadCommand($id, $index, $chunk, hash('sha256', $chunk)));
        }

        $bus->run(new CommitUploadCommand($id));

        $this->assertThrows(
            fn () => $bus->run(new EditDocumentCommand($target, 'Missing section', null, $id)),
            SectionMissing::class,
        );

        $bus->run(new EditDocumentCommand($target, '1', null, $id));
        $closed = $bus->run(new CloseDocumentCommand(new DraftTarget($created->id, $draft->token)));
        $this->assertSame(2, $closed->revisionNumber);
        $published = $this->app->make(DocumentResolver::class)->show($created->number);
        $this->assertSame($replacement, trim(substr($published->body, strlen("# Design\n"))));
    }

    public function test_another_editor_cannot_take_the_draft_and_bad_markdown_stays_unpublished(): void
    {
        $author = TestStart::start();
        $other = TestStart::start();
        $author->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $created = $bus->run(new CreateDocumentCommand('Design', 'The next design.', "# Design\nOld text.\n"));
        $draft = $bus->run(new OpenDocumentCommand($created->id, 1));

        $other->startRequest($this->app);
        $this->assertThrows(fn () => $bus->run(new OpenDocumentCommand($created->id, 1)), DraftHeld::class);

        $author->startRequest($this->app);
        $broken = "| A | B |\n| --- | --- |\n| one |";
        $bus->run(new EditDocumentCommand(new DraftTarget($created->id, $draft->token, 1), '1', $broken));

        $this->assertThrows(
            fn () => $bus->run(new CloseDocumentCommand(new DraftTarget($created->id, $draft->token))),
            DraftMarkdownInvalid::class,
            'line',
        );

        $this->assertSame('1', $this->app->make(DocumentResolver::class)->show($created->number)->revision);
        $this->assertStringContainsString($broken, $this->app->make(DraftResolver::class)->current(1)->body);
    }
}
