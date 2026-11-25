<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use Domain\Comments\Models\Comment;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

final class DocumentRoutesTest extends TestCase
{
    use CommitsHookRows;

    private const string REPLACEMENT = 'Replacement text.';

    private const string SECTION_COMMENT = 'Check the first section.';

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

    public function test_a_reviewer_is_refused_document_creation_on_the_signed_route(): void
    {
        $reviewer = TestStart::start('read-only-helper');

        $this->journal->agentCall($reviewer, 'POST', '/agent/docs/make', [
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
        $document = $commands->run(new CreateDocumentCommand('Design', 'Current design.', 'Original text.'));
        $draft = $commands->run(new OpenDocumentCommand($document->id, 1));

        $this->journal->agentCall($author, 'POST', '/agent/docs/edit', [
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
            new CreateDocumentCommand('Design', 'Current design.', 'Published text.'),
        );

        $this->journal->agentCall($author, 'POST', '/agent/docs/comment', [
            'doc_id' => $document->id,
            'body' => self::SECTION_COMMENT,
            'request_key' => 'comment-on-design',
        ])->assertOk();

        $this->assertSame(self::SECTION_COMMENT, Comment::query()->sole()->body);
    }
}
