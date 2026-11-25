<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * An agent closes only the reports it created.
 */
final class CloseReportTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'record_settlements',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(1));

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
    }

    public function test_an_agent_settles_only_the_reports_it_created(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $this->bus()->run(new CloseReportCommand('1', 'Checked.'));
        $this->assertSame(AttentionStatus::Settled, Report::query()->sole()->attention);

        $this->journal->actAsUserId(TestIds::of(1));
        $this->bus()->run(new CreateReportCommand('Other', 'By a user', "Text\n"));
        $this->journal->actAsAgentIds(TestIds::of(8), TestIds::of(80));
        $this->expectException(ActorNotAllowed::class);

        $this->bus()->run(new CloseReportCommand('2', 'Not mine.'));
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
