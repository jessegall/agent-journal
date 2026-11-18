<?php

declare(strict_types=1);

namespace Domain\Documents\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Documents\Console\DocListCommand;
use Domain\Documents\Console\DocMakeCommand;
use Domain\Documents\Console\DocShowCommand;
use Domain\Documents\Console\ReportListCommand;
use Domain\Documents\Console\ReportMakeCommand;
use Domain\Documents\Console\ReportShowCommand;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
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
        ]);

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands([DocMakeCommand::class, DocListCommand::class, DocShowCommand::class, ReportMakeCommand::class, ReportListCommand::class, ReportShowCommand::class]);
    }
}
