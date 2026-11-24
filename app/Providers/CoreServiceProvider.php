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
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Models\Agents\EngineFrameTime;
use App\Models\Asks\Ask;
use App\Models\Presence\UserPresence;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Drivers\ConversationVisit;
use App\Models\Drivers\DriverConversation;
use App\Models\Drivers\HookCall;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileDraft;
use App\Models\Profiles\ProfileDraftRevision;
use App\Models\Profiles\ProfileRevision;
use App\Models\Records\ClaimAuthorization;
use App\Models\Records\Comment;
use App\Models\Records\Link;
use App\Models\Records\SettingsRecord;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Models\Sharing\ShareInstallation;
use App\Models\Sharing\ShareMember;
use App\Models\Sharing\SharePreview;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Models\Skills\SkillRequest;
use App\Models\Skills\SkillRevision;
use App\Models\Starts\CapacityReservation;
use App\Models\Starts\StartBypass;
use App\Models\Starts\StartToken;
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
