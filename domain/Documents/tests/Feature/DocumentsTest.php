<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Support\ActsAsFirstUser;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A document is published with its text as revision 1 and a report is filed once; both are numbered across the
 * journal, read back by number, and never changed in place.
 */
final class DocumentsTest extends TestCase
{
    use ActsAsFirstUser;
    use CommitsHookRows;

    private const string GOAL_TEXT = <<<'TEXT'
        # Goal
        Ship it.

        TEXT;
    private const string FIRST_DOCUMENT = 'doc 1';

    private const string SECOND_DOCUMENT = 'doc 2';

    private const string FIRST_REPORT = 'report 1';

    private const string GOOD_REPORT = "All good\n";

    private const string TITLE_REQUIRED = 'title: The title field is required.';

    private const string ABSTRACT_ONE_LINE = 'abstract: The abstract must be one line';

    private const string TOO_MANY_RELATED = 'relatedRecords: '
        .'The related records field must not have more than 50 items.';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['reports', 'document_revisions', 'documents', 'number_groups'];

    public function test_documents_are_numbered_and_each_starts_at_revision_one(): void
    {
        $first = $this->bus()->run(new CreateDocument('Design', 'What we build', self::GOAL_TEXT));

        $second = $this->bus()->run(new CreateDocument('Notes', 'What we saw', "Text\n"));

        $this->assertSame(self::FIRST_DOCUMENT, $first->label());
        $this->assertSame(self::SECOND_DOCUMENT, $second->label());
        $this->assertSame(['1'], [$this->app->make(DocumentResolver::class)->show(2)->revision]);

        $this->assertSame(self::GOAL_TEXT, $this->app->make(DocumentResolver::class)->show(1)->body);
    }

    public function test_a_report_is_filed_and_a_document_number_never_selects_it(): void
    {
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $report = $this->bus()->run(new CreateReport('Check', 'What we found', self::GOOD_REPORT));

        $this->assertSame(self::FIRST_REPORT, $report->label());
        $this->assertSame(self::GOOD_REPORT, $this->app->make(ReportResolver::class)->show(1)->body);
        $this->assertCount(1, $this->app->make(DocumentResolver::class)->list(new DocumentFilters())->rows);
        $this->expectException(ReportMissing::class);
        $this->app->make(ReportResolver::class)->show(2);
    }

    public function test_an_empty_title_leaves_no_row_and_names_the_field(): void
    {
        $this->assertThrows(
            fn () => $this->bus()->run(new CreateDocument(' ', 'What we build', "Text\n")),
            CommandInputInvalid::class,
            self::TITLE_REQUIRED,
        );

        $this->assertSame(0, Document::query()->count());
    }

    public function test_a_two_line_abstract_or_too_many_links_leaves_no_row_and_names_the_field(): void
    {
        $about = array_map(
            fn (int $number) => new RecordIdentity('tasks.task', TestIds::of($number)),
            range(1, CreateDocument::MOST_LINKS + 1),
        );

        $this->assertThrows(
            fn () => $this->bus()->run(new CreateDocument('Design', "What we\nbuild", "Text\n")),
            CommandInputInvalid::class,
            self::ABSTRACT_ONE_LINE,
        );

        $this->assertThrows(
            fn () => $this->bus()->run(new CreateReport('Check', 'What we found', "Text\n", $about)),
            CommandInputInvalid::class,
            self::TOO_MANY_RELATED,
        );

        $this->assertSame(0, Document::query()->count() + Report::query()->count());
    }

    public function test_a_title_and_abstract_are_stored_trimmed(): void
    {
        $this->bus()->run(new CreateDocument('  Plan for May  ', ' What we build ', "Text\n"));
        $this->bus()->run(new CreateReport('  Plan for May  ', ' What we found ', "Text\n"));

        $document = $this->app->make(DocumentResolver::class)->show(1);

        $this->assertSame(['Plan for May', 'What we build'], [$document->title, $document->abstract]);

        $this->assertSame(['Plan for May', 'What we found'], [
            Report::query()->sole()->title,
            Report::query()->sole()->abstract,
        ]);
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
