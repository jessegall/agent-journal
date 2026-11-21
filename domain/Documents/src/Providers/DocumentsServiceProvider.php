<?php

declare(strict_types=1);

namespace Domain\Documents\Providers;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Values\ReadEntitlement;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\SessionProvenance;
use App\Autoload\Support\FolderClasses;
use App\Links\Support\LinkTypeRegistry;
use App\Operations\Enums\AccessType;
use Domain\Documents\Contracts\AttachmentReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Contracts\SealedUploads;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\RecordSettlement;
use Domain\Documents\Models\Report;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Resolvers\AttachmentPages;
use Domain\Documents\Resolvers\DocumentPages;
use Domain\Documents\Resolvers\DocumentRecords;
use Domain\Documents\Resolvers\DraftRecords;
use Domain\Documents\Resolvers\ReportPages;
use Domain\Documents\Resolvers\ReportRecords;
use Domain\Documents\Resolvers\RetainedDrafts;
use Domain\Documents\Support\UploadStore;
use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\ServiceProvider;

/**
 * Where the Documents domain binds its contracts, link types, routes and console commands.
 */
final class DocumentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DocumentResolver::class, DocumentRecords::class);
        $this->app->bind(DraftResolver::class, DraftRecords::class);
        $this->app->bind(DraftReader::class, RetainedDrafts::class);
        $this->app->bind(ReportResolver::class, ReportRecords::class);
        $this->app->bind(SealedUploads::class, UploadStore::class);
        $this->app->scoped(AttachmentReader::class, AttachmentPages::class);
        $this->app->scoped(DocumentReader::class, DocumentPages::class);
        $this->app->scoped(ReportReader::class, ReportPages::class);
    }

    public function boot(LinkTypeRegistry $links, ReadEntitlements $reads): void
    {
        $reads->declare('docs_drafts_read', ReadEntitlement::grant(DocumentPolicy::class, AccessType::Edit));
        $links->register([
            Document::LINK_TYPE => Document::class,
            DocumentRevision::LINK_TYPE => DocumentRevision::class,
            Report::LINK_TYPE => Report::class,
            RetainedDraft::LINK_TYPE => RetainedDraft::class,
            DocumentDraft::LINK_TYPE => DocumentDraft::class,
            DocumentClose::LINK_TYPE => DocumentClose::class,
            RecordSettlement::LINK_TYPE => RecordSettlement::class,
            TextUpload::LINK_TYPE => TextUpload::class,
        ]);

        TextUpload::addGlobalScope(
            TextUpload::SESSION_SCOPE,
            fn (Builder $uploads) => $this->app->make(SessionProvenance::class)->limitToCurrentSession($uploads),
        );
        TextUploadChunk::addGlobalScope(TextUpload::SESSION_SCOPE, fn (Builder $chunks) => $chunks->whereHas('upload'));
        TextUpload::deleting(fn (TextUpload $upload) => $this->app->make(SessionProvenance::class)->forget($upload));
        RetainedDraft::addGlobalScope(RetainedDraft::DRAFT_SCOPE, $this->limitDrafts(...));
        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->call(fn (UploadStore $uploads) => $uploads->pruneExpired())->daily(),
        );

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
    }

    /**
     * @param  Builder<RetainedDraft>  $drafts
     */
    private function limitDrafts(Builder $drafts): void
    {
        if ($this->app->make(RetainedDrafts::class)->mayAdminister()) {
            return;
        }

        if (! $this->app->make(CurrentSession::class)->hasSession()) {
            $drafts->whereKey([]);

            return;
        }

        $this->app->make(SessionProvenance::class)->limitToCurrentSession($drafts);
    }
}
