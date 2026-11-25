<?php

declare(strict_types=1);

namespace Domain\Documents\Providers;

use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Notifications\NotificationTargets;
use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Sessions\SessionProvenance;
use App\Enums\Agents\AccessType;
use App\Support\FolderClasses;
use App\Support\Sources\Contracts\DockRegistration;
use App\Values\ReadEntitlement;
use Domain\Documents\Contracts\Attachments\AttachmentReader;
use Domain\Documents\Contracts\Documents\DocumentReader;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftReader;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Contracts\Reports\ReportReader;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Resolvers\AttachmentPages;
use Domain\Documents\Resolvers\DocumentPages;
use Domain\Documents\Resolvers\DocumentRecords;
use Domain\Documents\Resolvers\DraftRecords;
use Domain\Documents\Resolvers\ReportNotificationTarget;
use Domain\Documents\Resolvers\ReportPages;
use Domain\Documents\Resolvers\ReportRecords;
use Domain\Documents\Resolvers\RetainedDrafts;
use Domain\Documents\Support\DocumentDocking;
use Domain\Documents\Support\ReportDocking;
use Domain\Documents\Support\SealedAttachments;
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
        $this->app->scoped(AttachmentReader::class, AttachmentPages::class);
        $this->app->scoped(AttachmentReferences::class, SealedAttachments::class);
        $this->app->scoped(DocumentReader::class, DocumentPages::class);
        $this->app->scoped(ReportReader::class, ReportPages::class);
    }

    public function boot(
        ReadEntitlements $reads,
        DockRegistration $docks,
        NotificationTargets $notificationTargets,
    ): void {
        $notificationTargets->register(ReportNotificationTarget::KEY, ReportNotificationTarget::class);
        $docks->offerDockFor($docks->register(Document::linkType(), Document::class, DocumentDocking::class));
        $docks->offerDockFor($docks->register(Report::linkType(), Report::class, ReportDocking::class));
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
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));
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
