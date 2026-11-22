<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Bus\PipelineRunner as PipelineRunnerContract;
use App\Contracts\Processes\StatementDeadlines;
use App\Contracts\Search\MessageSearch;
use App\Contracts\Search\RecordSearch;
use App\Contracts\Search\SearchSources;
use App\Contracts\Search\TieredSearch;
use App\Enums\AssignmentPurpose;
use App\Mcp\Models\RetainedPage;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Models\Agent;
use App\Models\AgentSession;
use App\Models\AgentStackRow;
use App\Models\Ask;
use App\Models\CapacityReservation;
use App\Models\ClaimAuthorization;
use App\Models\CommandReceipt;
use App\Models\Comment;
use App\Models\ConversationVisit;
use App\Models\DriverConversation;
use App\Models\EngineFrameTime;
use App\Models\HookCall;
use App\Models\Link;
use App\Models\Profile;
use App\Models\ProfileDraft;
use App\Models\ProfileDraftRevision;
use App\Models\ProfileRevision;
use App\Models\SettingsRecord;
use App\Models\Share;
use App\Models\ShareAudit;
use App\Models\ShareGatewayConfiguration;
use App\Models\ShareGatewayEndpoint;
use App\Models\ShareGatewayOperation;
use App\Models\ShareInstallation;
use App\Models\ShareMember;
use App\Models\SharePreview;
use App\Models\SignInAttempt;
use App\Models\Skill;
use App\Models\SkillGeneration;
use App\Models\SkillPublication;
use App\Models\SkillRequest;
use App\Models\SkillRevision;
use App\Models\StartBypass;
use App\Models\StartToken;
use App\Models\UserPresence;
use App\Support\AskAssignments;
use App\Support\FolderClasses;
use App\Support\LinkTypeRegistry;
use App\Support\MessageSearchProvider;
use App\Support\PipelineRunner;
use App\Support\SearchCoordinator;
use App\Support\SearchEligibility;
use App\Support\StatementDeadline;
use App\Support\TieredRecordSearch;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Loads the core that every domain and module builds on: the migrations and listeners of its agents, hooks and links.
 * The core names no domain; domains and modules plug into it.
 */
final class CoreServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PipelineRunnerContract::class, PipelineRunner::class);
        $this->app->bind(TieredSearch::class, TieredRecordSearch::class);
        $this->app->bind(RecordSearch::class, SearchCoordinator::class);
        $this->app->bind(SearchSources::class, SearchEligibility::class);
        $this->app->bind(StatementDeadlines::class, StatementDeadline::class);
        $this->app->bind(MessageSearch::class, MessageSearchProvider::class);
    }

    public function boot(LinkTypeRegistry $links, AssignmentRegistration $assignments): void
    {
        // Core's Artisan commands, app/Console/Commands, for the console and for the journal routes that list them.
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));

        $assignments->registerOwner('Supervision', []);

        $assignments->registerRecord(
            Ask::LINK_TYPE,
            AskAssignments::class,
            'Supervision',
            AssignmentPurpose::JournalAssigned,
        );

        $links->register([
            'core.agent' => Agent::class,
            'core.agent-session' => AgentSession::class,
            'core.start-bypass' => StartBypass::class,
            'core.start-token' => StartToken::class,
            'core.agent-stack' => AgentStackRow::class,
            'core.hook-call' => HookCall::class,
            'core.link' => Link::class,
            'core.claim-authorization' => ClaimAuthorization::class,
            'core.comment' => Comment::class,
            'core.settings-record' => SettingsRecord::class,
            'core.user-presence' => UserPresence::class,
            'core.engine-frame-time' => EngineFrameTime::class,
            'core.capacity-reservation' => CapacityReservation::class,
            'core.conversation-visit' => ConversationVisit::class,
            'core.driver-conversation' => DriverConversation::class,
            'core.skill-publication' => SkillPublication::class,
            'core.skill-request' => SkillRequest::class,
            Profile::LINK_TYPE => Profile::class,
            ProfileDraft::LINK_TYPE => ProfileDraft::class,
            ProfileDraftRevision::LINK_TYPE => ProfileDraftRevision::class,
            ProfileRevision::LINK_TYPE => ProfileRevision::class,
            Account::LINK_TYPE => Account::class,
            ActiveAccount::LINK_TYPE => ActiveAccount::class,
            SignInAttempt::LINK_TYPE => SignInAttempt::class,
            RetainedPage::LINK_TYPE => RetainedPage::class,
            CommandReceipt::LINK_TYPE => CommandReceipt::class,
            Share::LINK_TYPE => Share::class,
            ShareAudit::LINK_TYPE => ShareAudit::class,
            ShareGatewayConfiguration::LINK_TYPE => ShareGatewayConfiguration::class,
            ShareGatewayEndpoint::LINK_TYPE => ShareGatewayEndpoint::class,
            ShareGatewayOperation::LINK_TYPE => ShareGatewayOperation::class,
            ShareInstallation::LINK_TYPE => ShareInstallation::class,
            ShareMember::LINK_TYPE => ShareMember::class,
            SharePreview::LINK_TYPE => SharePreview::class,
            Skill::LINK_TYPE => Skill::class,
            SkillRevision::LINK_TYPE => SkillRevision::class,
            SkillGeneration::LINK_TYPE => SkillGeneration::class,
        ]);
    }
}
