<?php

declare(strict_types=1);

namespace Domain\Documents\Providers;

use App\Access\Contracts\ReadEntitlements;
use App\Access\Values\ReadEntitlement;
use App\Agents\Drivers\Contracts\AttachmentReferences;
use App\Agents\Enums\AccessType;
use App\Notifications\Contracts\NotificationTargets;
use App\Records\Contracts\RecordSummaries;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\Contracts\SessionProvenance;
use App\Support\Codebase;
use Domain\Documents\Contracts\Attachments\AttachmentReader as AttachmentReaderContract;
use Domain\Documents\Contracts\Documents\DocumentReader as DocumentReaderContract;
use Domain\Documents\Contracts\Documents\DocumentResolver as DocumentResolverContract;
use Domain\Documents\Contracts\Drafts\DraftReader as DraftReaderContract;
use Domain\Documents\Contracts\Drafts\DraftResolver as DraftResolverContract;
use Domain\Documents\Contracts\Reports\ReportReader as ReportReaderContract;
use Domain\Documents\Contracts\Reports\ReportResolver as ReportResolverContract;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Resolvers\AttachmentReader;
use Domain\Documents\Resolvers\DocumentReader;
use Domain\Documents\Resolvers\DocumentResolver;
use Domain\Documents\Resolvers\DraftReader;
use Domain\Documents\Resolvers\DraftResolver;
use Domain\Documents\Resolvers\ReportNotificationTarget;
use Domain\Documents\Resolvers\ReportReader;
use Domain\Documents\Resolvers\ReportResolver;
use Domain\Documents\Support\DocumentSummaries;
use Domain\Documents\Support\ReportSummaries;
use Domain\Documents\Support\SealedAttachments;
use Domain\Documents\Support\UploadStore;
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
        $this->app->bind(DocumentResolverContract::class, DocumentResolver::class);
        $this->app->bind(DraftResolverContract::class, DraftResolver::class);
        $this->app->bind(DraftReaderContract::class, DraftReader::class);
        $this->app->bind(ReportResolverContract::class, ReportResolver::class);
        $this->app->scoped(AttachmentReaderContract::class, AttachmentReader::class);
        $this->app->scoped(AttachmentReferences::class, SealedAttachments::class);
        $this->app->scoped(DocumentReaderContract::class, DocumentReader::class);
        $this->app->scoped(ReportReaderContract::class, ReportReader::class);
    }

    public function boot(
        ReadEntitlements $reads,
        RecordSummaries $summaries,
        NotificationTargets $notificationTargets,
    ): void {
        $notificationTargets->register(ReportNotificationTarget::KEY, ReportNotificationTarget::class);
        $summaries->register(Document::linkType(), DocumentSummaries::class);
        $summaries->register(Report::linkType(), ReportSummaries::class);
        $reads->declare('docs_drafts_read', ReadEntitlement::grant(DocumentPolicy::class, AccessType::Edit));

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

        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/agent.php');
        $this->commands(Codebase::consoleCommandsIn(dirname(__DIR__)));
    }

    /**
     * @param  Builder<RetainedDraft>  $drafts
     */
    private function limitDrafts(Builder $drafts): void
    {
        if ($this->app->make(DraftReader::class)->mayAdminister()) {
            return;
        }

        if (! $this->app->make(CurrentSession::class)->hasSession()) {
            $drafts->whereKey([]);

            return;
        }

        $this->app->make(SessionProvenance::class)->limitToCurrentSession($drafts);
    }
}
