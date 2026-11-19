<?php

declare(strict_types=1);

namespace Domain\Documents\Providers;

use App\Autoload\Support\FolderClasses;
use App\Links\Support\LinkTypeRegistry;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\RecordSettlement;
use Domain\Documents\Models\Report;
use Illuminate\Console\Command;
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
            RecordSettlement::LINK_TYPE => RecordSettlement::class,
        ]);

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
    }
}
