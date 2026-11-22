<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\AppendUpload;
use Domain\Documents\Commands\BeginUpload;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CommitUpload;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\EditDocument;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Contracts\AttachmentReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Tests\TestCase;
use Laravel\Mcp\Request;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

final class DocumentReaderTest extends TestCase
{
    use CommitsHookRows;

    private const string ABSTRACT = 'How to use a request key.';

    private const string RETRY_SECTION = "## Retry\nKeep your key.\n";

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'command_receipts', 'links', 'number_groups',
        'documents', 'document_revisions', 'document_drafts', 'document_closes', 'text_uploads', 'text_upload_chunks',
    ];

    public function test_summary_and_sections_have_outline_and_revision_without_returning_the_whole_document(): void
    {
        TestStart::start()->startRequest($this->app);
        $body = "# Guide\nFirst paragraph.\n\n## Retry\nKeep your key.\n\n## Examples\n".str_repeat("A row.\n", 8000);

        $id = $this->app->make(CommandBus::class)->run(
            new CreateDocument('Guide', self::ABSTRACT, $body),
        )->number;

        $summary = $this->read($id, ['view' => 'summary'])->responseFields;
        $this->assertSame(['1 Guide', '2 Retry', '3 Examples'], $summary['outline']);
        $this->assertSame(self::ABSTRACT, $summary['abstract']);
        $this->assertArrayNotHasKey('body', $summary);

        $section = $this->read($id, ['view' => 'body', 'section' => 'Retry'])->responseFields;
        $this->assertSame([1, 4, 6], [$section['revision'], $section['line_start'], $section['line_end']]);
        $this->assertSame(self::RETRY_SECTION, $section['body']);
    }

    public function test_a_current_cursor_expires_on_publication_and_a_pinned_cursor_keeps_its_revision(): void
    {
        TestStart::start()->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $created = $bus->run(new CreateDocument('Guide', 'A long line.', "# Guide\nOriginal."));
        $number = $created->number;
        $this->publish($number, str_repeat('a', 10000));
        $range = ['view' => 'body', 'line_start' => 2, 'line_end' => 2, 'character_offset' => 0];

        $current = $this->read($number, $range);
        $pinned = $this->read($number, [...$range, 'revision' => 2]);
        $this->assertSame(str_repeat('a', 4096), $pinned->responseFields['body']);
        $this->publish($number, 'Replacement.');

        $currentCursor = $current->nextActions[0]->arguments['continuation'];

        $this->assertThrows(
            fn () => $this->read($number, ['continuation' => $currentCursor]),
            ContinuationStale::class,
        );

        $pinnedCursor = $pinned->nextActions[0]->arguments['continuation'];
        $continued = $this->read($number, ['continuation' => $pinnedCursor]);

        $this->assertSame([2, 2, 4096], [
            $continued->responseFields['revision'],
            $continued->responseFields['line_start'],
            $continued->responseFields['character_offset'],
        ]);

        $this->assertSame(str_repeat('a', 4096), $continued->responseFields['body']);
    }

    public function test_a_sealed_attachment_can_only_be_read_in_its_own_session(): void
    {
        TestStart::start()->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $text = 'Attachment bytes.';
        $digest = hash('sha256', $text);
        $id = $bus->run(new BeginUpload(UploadType::ReportBody, strlen($text), $digest));
        $bus->run(new AppendUpload($id, 0, $text, $digest));
        $bus->run(new CommitUpload($id));

        $answer = $this->app->make(AttachmentReader::class)->attachment($id, null);
        $this->assertSame($text, $answer->responseFields['body']);
        TestStart::start()->startRequest($this->app);

        $this->assertThrows(
            fn () => $this->app->make(AttachmentReader::class)->attachment($id, null),
            UploadExpired::class,
        );
    }

    private function publish(int $number, string $body): void
    {
        $bus = $this->app->make(CommandBus::class);
        $draft = $bus->run(new OpenDocument((string) $number));
        $bus->run(new EditDocument(new DraftTarget((string) $number, $draft->token, $draft->version), '1', $body));
        $bus->run(new CloseDocument(new DraftTarget((string) $number, $draft->token)));
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function read(int $number, array $arguments): ToolResult
    {
        $fields = ['view', 'revision', 'section', 'line_start', 'line_end', 'character_offset', 'continuation'];

        return $this->app->make(DocumentReader::class)->document(
            $number,
            ToolArguments::read('docs_read', new Request($arguments), $fields),
        );
    }
}
