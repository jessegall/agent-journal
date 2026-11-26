<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

/**
 * A report is filed under its own numbers, and a document number never selects it.
 */
#[TestsCommand(CreateReportCommand::class)]
final class CreateReportTest extends TestCase
{
    use CommitsHookRows;

    private const string FIRST_REPORT = 'report 1';

    private const string GOOD_REPORT = "All good\n";

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_report_is_filed_and_a_document_number_never_selects_it(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n", TestProjects::local()->id));

        $report = $this->bus()->run(new CreateReportCommand(
            'Check',
            'What we found',
            self::GOOD_REPORT,
            TestProjects::local()->id,
        ));

        $this->assertSame(self::FIRST_REPORT, $report->label());
        $this->assertSame(self::GOOD_REPORT, $this->app->make(ReportResolver::class)->show(1)->body);
        $this->assertCount(1, $this->app->make(DocumentResolver::class)->list(new DocumentFilters())->rows);
        $this->expectException(ReportMissing::class);
        $this->app->make(ReportResolver::class)->show(2);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
