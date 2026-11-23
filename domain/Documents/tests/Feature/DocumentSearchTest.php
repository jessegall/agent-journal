<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Enums\ScoreTier;
use App\Enums\SearchSurface;
use App\Mcp\Support\ToolArguments;
use App\Support\ActorContext;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\SourcePosition;
use App\Values\WorkBudget;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Contracts\Documents\DocumentReader;
use Domain\Documents\Support\DocumentSearchAccess;
use Domain\Documents\Support\DocumentSearchProvider;
use Domain\Documents\Tests\TestCase;
use Domain\Documents\Values\DraftTarget;
use Laravel\Mcp\Request;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

/**
 * A phrase in a document's published section is found as a passage that opens at its line through docs_read, a
 * word only in an open draft gives no hit, and a document reference resolves at tier 500.
 */
final class DocumentSearchTest extends TestCase
{
    use CommitsHookRows;

    private const string RETRY_LINE = 'Keep your idempotency key.';

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'command_receipts', 'links', 'number_groups',
        'documents', 'document_revisions', 'document_drafts', 'document_closes', 'text_uploads', 'text_upload_chunks',
    ];

    private const string USER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FZZ';

    public function test_a_phrase_in_a_section_opens_at_its_line(): void
    {
        TestStart::start()->startRequest($this->app);
        $body = "# Guide\nFirst paragraph.\n\n## Retry\n".self::RETRY_LINE."\n";
        $created = $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Guide', 'About keys.', $body));
        $number = $created->number;

        $hit = $this->firstHit('idempotency key');

        $this->assertSame(ScoreTier::BodyContains, $hit->score);
        $this->assertNotNull($hit->location);
        $open = $this->app->make(DocumentSearchAccess::class)->openAction($hit->reference->id, $hit->location);
        $this->assertSame(5, $open->arguments['line_start']);

        $fields = ['view', 'revision', 'section', 'line_start', 'line_end', 'character_offset', 'continuation'];

        $read = $this->app->make(DocumentReader::class)->document(
            $number,
            ToolArguments::read('docs_read', new Request(array_diff_key($open->arguments, ['doc_id' => 1])), $fields),
        );

        $this->assertStringStartsWith(self::RETRY_LINE, $read->responseFields['body']);
    }

    public function test_a_word_only_in_an_open_draft_gives_no_hit(): void
    {
        TestStart::start()->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $number = $bus->run(new CreateDocumentCommand('Guide', 'About keys.', "# Guide\nPublished words.\n"))->number;
        $draft = $bus->run(new OpenDocumentCommand((string) $number));

        $bus->run(new EditDocumentCommand(
            new DraftTarget((string) $number, $draft->token, $draft->version),
            '1',
            "# Secretdraftword\nUnpublished.\n",
        ));

        $this->assertNull($this->hitFor('secretdraftword'));
        $bus->run(new CloseDocumentCommand(new DraftTarget((string) $number, $draft->token)));
        $this->assertNotNull($this->hitFor('secretdraftword'));
    }

    public function test_a_document_reference_comes_first(): void
    {
        TestStart::start()->startRequest($this->app);

        $number = $this->app->make(CommandBus::class)->run(
            new CreateDocumentCommand('One search across domain declarations', 'About search.', "# Search\nText.\n"),
        )->number;

        $reference = "doc {$number}";
        $hit = $this->firstHit($reference);

        $this->assertSame(ScoreTier::Reference, $hit->score);
        $this->assertSame(ucfirst($reference), $hit->snippet);
    }

    private function firstHit(string $words): SearchResult
    {
        $hit = $this->hitFor($words);
        $this->assertNotNull($hit);

        return $hit;
    }

    private function hitFor(string $words): SearchResult|null
    {
        $provider = $this->app->make(DocumentSearchProvider::class);

        $query = new SearchQuery(
            new SearchReader(ActorContext::forUser(self::USER_ID), SearchSurface::Palette),
            SearchWords::fromInput($words),
            SearchScope::within('documents.document'),
            'documents.document',
            10,
            WorkBudget::forBatch(150),
        );

        $batch = $provider->search($query);

        for ($call = 0; $call < 10 && $batch->hits === [] && ! $batch->isExhausted(); $call++) {
            $batch = $provider->search($query->from($this->next($batch)));
        }

        return $batch->hits[0] ?? null;
    }

    private function next(SearchBatch $batch): SourcePosition
    {
        return $batch->outcome->nextPosition() ?? $this->fail('the search ended before it found a hit');
    }
}
