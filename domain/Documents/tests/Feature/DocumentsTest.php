<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use App\Text\Exceptions\ContentMissing;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A document is published with its text as revision 1 and a report is filed once; both are numbered across the
 * journal, read back by number, and never changed in place.
 */
final class DocumentsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['reports', 'document_revisions', 'documents', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)), new TrustedEntryAuthority('test'));
    }

    public function test_documents_are_numbered_and_each_starts_at_revision_one(): void
    {
        $first = $this->bus()->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $second = $this->bus()->run(new CreateDocument('Notes', 'What we saw', "Text\n"));

        $this->assertSame('doc 1', $first->label());
        $this->assertSame('doc 2', $second->label());
        $this->assertSame(['1'], [$this->app->make(DocumentResolver::class)->show(2)->revision]);
        $this->assertSame("# Goal\nShip it.\n", $this->app->make(DocumentResolver::class)->show(1)->body);
    }

    public function test_a_report_is_filed_and_a_document_number_never_selects_it(): void
    {
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $report = $this->bus()->run(new CreateReport('Check', 'What we found', "All good\n"));

        $this->assertSame('report 1', $report->label());
        $this->assertSame('All good'."\n", $this->app->make(ReportResolver::class)->show(1)->body);
        $this->assertCount(1, $this->app->make(DocumentResolver::class)->list(new DocumentFilters())->rows);
        $this->expectException(ReportMissing::class);
        $this->app->make(ReportResolver::class)->show(2);
    }

    public function test_an_empty_title_leaves_no_row_and_names_the_field(): void
    {
        try {
            $this->bus()->run(new CreateDocument(' ', 'What we build', "Text\n"));
            $this->fail('An empty title was accepted.');
        } catch (ContentMissing $missing) {
            $this->assertStringContainsString('title', $missing->getMessage());
        }

        $this->assertSame(0, Document::query()->count());
    }

    public function test_a_saved_revision_does_not_change(): void
    {
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $revision = DocumentRevision::query()->sole();

        $this->expectException(RecordImmutable::class);

        $revision->forceFill(['body' => 'changed'])->save();
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
