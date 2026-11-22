<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Comments\Models\Comment;
use App\Text\Exceptions\SectionMissing;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\AppendUpload;
use Domain\Documents\Commands\BeginUpload;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CommitUpload;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\EditDocument;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\DraftMarkdownInvalid;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;

final class DocumentEditTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const string REPLACEMENT = 'Replacement text.';

    private const string SECTION_COMMENT = 'Check the first section.';

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'command_receipts', 'links',
        'documents', 'document_revisions', 'document_drafts', 'document_closes', 'number_groups',
        'text_uploads', 'text_upload_chunks', 'comments',
    ];

    public function test_a_designer_can_publish_a_section_from_a_sealed_upload(): void
    {
        $designer = TestStart::start('writing-helper');
        $designer->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $created = $bus->run(new CreateDocument('Design', 'The next design.', "# Design\nOld text.\n"));
        $draft = $bus->run(new OpenDocument($created->id, 1));
        $target = new DraftTarget($created->id, $draft->token, 1);
        $replacement = str_repeat('a', 1024 * 1024);

        $id = $bus->run(new BeginUpload(
            UploadType::EditReplacement,
            strlen($replacement),
            hash('sha256', $replacement),
        ));

        foreach (str_split($replacement, TextUpload::CHUNK_BYTES) as $index => $chunk) {
            $bus->run(new AppendUpload($id, $index, $chunk, hash('sha256', $chunk)));
        }

        $bus->run(new CommitUpload($id));

        $this->assertThrows(
            fn () => $bus->run(new EditDocument($target, 'Missing section', null, $id)),
            SectionMissing::class,
        );

        $bus->run(new EditDocument($target, '1', null, $id));
        $closed = $bus->run(new CloseDocument(new DraftTarget($created->id, $draft->token)));
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
        $created = $bus->run(new CreateDocument('Design', 'The next design.', "# Design\nOld text.\n"));
        $draft = $bus->run(new OpenDocument($created->id, 1));

        $other->startRequest($this->app);
        $this->assertThrows(fn () => $bus->run(new OpenDocument($created->id, 1)), DraftHeld::class);

        $author->startRequest($this->app);
        $broken = "| A | B |\n| --- | --- |\n| one |";
        $bus->run(new EditDocument(new DraftTarget($created->id, $draft->token, 1), '1', $broken));

        $this->assertThrows(
            fn () => $bus->run(new CloseDocument(new DraftTarget($created->id, $draft->token))),
            DraftMarkdownInvalid::class,
            'line',
        );

        $this->assertSame('1', $this->app->make(DocumentResolver::class)->show($created->number)->revision);
        $this->assertStringContainsString($broken, $this->app->make(DraftResolver::class)->current(1)->body);
    }

    public function test_a_reviewer_is_refused_document_creation_on_the_signed_route(): void
    {
        $reviewer = TestStart::start('read-only-helper');

        $this->signed($reviewer, '/agent/docs/make', [
            'title' => 'Design',
            'abstract' => 'The next design.',
            'body' => 'Public text.',
            'about' => [],
            'request_key' => 'reviewer-doc',
        ])->assertForbidden();
    }

    public function test_signed_text_replacement_accepts_the_old_and_new_wire_fields(): void
    {
        $author = TestStart::start('writing-helper');
        $author->startRequest($this->app);
        $commands = $this->app->make(CommandBus::class);
        $document = $commands->run(new CreateDocument('Design', 'Current design.', 'Original text.'));
        $draft = $commands->run(new OpenDocument($document->id, 1));

        $this->signed($author, '/agent/docs/edit', [
            'number' => (string) $document->number,
            'token' => $draft->token,
            'version' => 1,
            'mode' => 'text',
            'section' => null,
            'body' => null,
            'old' => 'Original text.',
            'new' => self::REPLACEMENT,
            'title' => null,
            'abstract' => null,
            'request_key' => 'replace-design-words',
        ])->assertOk();

        $author->startRequest($this->app);

        $this->assertSame(
            self::REPLACEMENT,
            $this->app->make(DraftResolver::class)->current($document->number)->body,
        );
    }

    public function test_the_signed_comment_route_posts_on_the_document(): void
    {
        $author = TestStart::start();
        $author->startRequest($this->app);

        $document = $this->app->make(CommandBus::class)->run(
            new CreateDocument('Design', 'Current design.', 'Published text.'),
        );

        $this->signed($author, '/agent/docs/comment', [
            'doc_id' => $document->id,
            'body' => self::SECTION_COMMENT,
            'request_key' => 'comment-on-design',
        ])->assertOk();

        $this->assertSame(self::SECTION_COMMENT, Comment::query()->sole()->body);
    }
}
