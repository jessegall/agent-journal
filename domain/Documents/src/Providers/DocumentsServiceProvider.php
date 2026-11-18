<?php

declare(strict_types=1);

namespace Domain\Documents\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Documents\Console\DocCloseCommand;
use Domain\Documents\Console\DocCommentsCommand;
use Domain\Documents\Console\DocEditCommand;
use Domain\Documents\Console\DocInspectCommand;
use Domain\Documents\Console\DocListCommand;
use Domain\Documents\Console\DocMakeCommand;
use Domain\Documents\Console\DocOpenCommand;
use Domain\Documents\Console\DocRevisionCommand;
use Domain\Documents\Console\DocRevisionsCommand;
use Domain\Documents\Console\DocSettleCommand;
use Domain\Documents\Console\DocShowCommand;
use Domain\Documents\Console\DocumentsBenchmarkCommand;
use Domain\Documents\Console\ReportCommentsCommand;
use Domain\Documents\Console\ReportEditCommand;
use Domain\Documents\Console\ReportInspectCommand;
use Domain\Documents\Console\ReportListCommand;
use Domain\Documents\Console\ReportMakeCommand;
use Domain\Documents\Console\ReportSettleCommand;
use Domain\Documents\Console\ReportShowCommand;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\RecordComment;
use Domain\Documents\Models\RecordDock;
use Domain\Documents\Models\RecordSettlement;
use Domain\Documents\Models\Report;
use Illuminate\Support\ServiceProvider;

/**
 * Where the Documents domain binds its contracts, link types, routes and console commands.
 */
final class DocumentsServiceProvider extends ServiceProvider
{
    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([
            Document::LINK_TYPE => Document::class,
            DocumentRevision::LINK_TYPE => DocumentRevision::class,
            Report::LINK_TYPE => Report::class,
            DocumentDraft::LINK_TYPE => DocumentDraft::class,
            DocumentClose::LINK_TYPE => DocumentClose::class,
            RecordComment::LINK_TYPE => RecordComment::class,
            RecordSettlement::LINK_TYPE => RecordSettlement::class,
            RecordDock::LINK_TYPE => RecordDock::class,
        ]);

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands([DocMakeCommand::class, DocListCommand::class, DocShowCommand::class, DocOpenCommand::class, DocEditCommand::class, DocCloseCommand::class, DocRevisionsCommand::class, DocRevisionCommand::class, DocCommentsCommand::class, ReportCommentsCommand::class, DocSettleCommand::class, ReportSettleCommand::class, DocInspectCommand::class, ReportInspectCommand::class, ReportEditCommand::class, ReportMakeCommand::class, ReportListCommand::class, ReportShowCommand::class, DocumentsBenchmarkCommand::class]);
    }
}
