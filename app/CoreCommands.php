<?php

declare(strict_types=1);

namespace App;

use App\Agents\CommandMiddleware\AnnounceUnavailableLaunch;
use App\Agents\Commands\CancelAccountUses;
use App\Agents\Commands\CancelDriverRequest;
use App\Agents\Commands\CancelKeyScript;
use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Commands\ClaimStart;
use App\Agents\Commands\ContinueLaunch;
use App\Agents\Commands\CreateAgent;
use App\Agents\Commands\DeliverAgent;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\FenceProfileRevision;
use App\Agents\Commands\HoldAccountUses;
use App\Agents\Commands\InterruptAgent;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Commands\ReassignAgentRuntime;
use App\Agents\Commands\ReconcileStarts;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\RecordRuntime;
use App\Agents\Commands\ReleaseAgentHold;
use App\Agents\Commands\RepairDriverSettings;
use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Commands\ReportFailure;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Commands\ReportRunning;
use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Commands\ReportStopped;
use App\Agents\Commands\ResolveDriverDelivery;
use App\Agents\Commands\ResumeKeyScript;
use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\RetryDriverRequest;
use App\Agents\Commands\RunKeyScript;
use App\Agents\Commands\SettleAccountUses;
use App\Agents\Commands\StopAgent;
use App\Agents\Commands\WakeAgent;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ConfigureAutoAssignment;
use App\Assignments\Commands\DisableAutoAssignment;
use App\Assignments\Commands\EnableAutoAssignment;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Bus\Contracts\Command;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Communication\Commands\AskMessage;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\ReadMessages;
use App\Communication\Commands\ReleaseMessageClaim;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SendMessage;
use App\Communication\Commands\TakeNextMessages;
use App\Desks\Commands\CreateDesk;
use App\Desks\Commands\InstallDesks;
use App\Desks\Commands\ProvisionActorDesk;
use App\Desks\Commands\ReleaseSeat;
use App\Desks\Commands\ReplaceSeatOccupant;
use App\Desks\Commands\RestoreActorDesk;
use App\Desks\Commands\SeatActor;
use App\Engine\CommandMiddleware\GuardTickOrigin;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Commands\SettleFrameTimes;
use App\Numbers\Commands\InstallNumbers;
use App\Processes\Commands\ApproveRuleBundle;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Commands\ApproveSample;
use App\Processes\Commands\AssessPartOutput;
use App\Processes\Commands\CleanProcessOutput;
use App\Processes\Commands\ImportRuleProposals;
use App\Processes\Commands\IssueEvidencePermit;
use App\Processes\Commands\MarkRunsStale;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Commands\ProposeReader;
use App\Processes\Commands\ProveReader;
use App\Processes\Commands\ReadPartLive;
use App\Processes\Commands\ReconcileLostRuns;
use App\Processes\Commands\RecordEvidenceReads;
use App\Processes\Commands\RejectRuleProposal;
use App\Processes\Commands\ReplayAssessment;
use App\Processes\Commands\RestoreCommandRule;
use App\Processes\Commands\RetireCommandRule;
use App\Processes\Commands\RetryProcessRun;
use App\Processes\Commands\ReviseRuleProposal;
use App\Processes\Commands\RevokeCommandPermissions;
use App\Processes\Commands\SaveCommandRule;
use App\Processes\Commands\SettleSample;
use App\Processes\Commands\StartSample;
use App\Processes\Commands\StopProcessRun;
use App\Processes\Commands\StopSurvivors;
use App\Processes\Commands\VerifyRestoredOutput;
use App\Processes\Commands\WithdrawCommandRequest;
use App\Processes\Commands\WithdrawRuleProposal;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\CheckAccount;
use App\Profiles\Commands\ClaimAccountCheck;
use App\Profiles\Commands\ClaimSignIn;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Commands\DismissAccountNotice;
use App\Profiles\Commands\ExpireSignInAttempt;
use App\Profiles\Commands\InstallBuiltInProfiles;
use App\Profiles\Commands\LaunchProfileMain;
use App\Profiles\Commands\MaintainAccount;
use App\Profiles\Commands\PublishSignInChallenge;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Commands\RecordAccountFailure;
use App\Profiles\Commands\ReleaseSignInAgain;
use App\Profiles\Commands\RenameAccount;
use App\Profiles\Commands\ReportSignIn;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Commands\TakeSignInCode;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Commands\ResetSetting;
use App\Settings\Commands\ResetSettingGroup;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Commands\SetDecimalSetting;
use App\Settings\Commands\SetIntegerChoice;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Commands\SetStringChoice;
use App\Settings\Commands\SetStringSetting;
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\DisableShareGateway;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\PruneShareAudit;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Commands\RefreshShareScope;
use App\Sharing\Commands\ReopenSharedGateways;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Commands\RetryShare;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Skills\CommandMiddleware\RefuseWritesDuringEvaluation;
use App\Skills\Commands\ActivateSkillPublication;
use App\Skills\Commands\CopySkill;
use App\Skills\Commands\CreateSkill;
use App\Skills\Commands\FailSkillPublication;
use App\Skills\Commands\PrepareSkillPublication;
use App\Skills\Commands\PruneSkillPublications;
use App\Skills\Commands\PublishSkills;
use App\Skills\Commands\RecordSkillRead;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Commands\RestoreSkill;
use App\Skills\Commands\RetireSkill;
use App\Skills\Commands\RetrySkillPublication;
use App\Skills\Commands\ReviseSkill;
use App\Web\Commands\RecordUserHeartbeat;

/**
 * Core's own commands and middleware, read at start-up beside the domains' (doc 19, section 6.1).
 */
final class CoreCommands
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public static function commands(): array
    {
        return [
            AssignRecord::class, ReassignRecord::class, UnassignRecord::class,
            InstallDesks::class, ProvisionActorDesk::class, RestoreActorDesk::class, CreateDesk::class, SeatActor::class, ReplaceSeatOccupant::class, ReleaseSeat::class,
            EnableAutoAssignment::class, ConfigureAutoAssignment::class, DisableAutoAssignment::class,
            RetireAgent::class,
            HoldAccountUses::class,
            CancelAccountUses::class,
            SettleAccountUses::class,
            ClaimStart::class,
            ReportRunning::class,
            ReportStopped::class,
            ReportFailure::class,
            ReconcileStarts::class,
            FenceProfileRevision::class,
            LaunchAgent::class,
            ContinueLaunch::class,
            CreateAgent::class,
            EnrollHost::class,
            OpenAgentRuntime::class,
            DeliverAgent::class,
            WakeAgent::class,
            ChangeAgentModel::class,
            ChangeAgentEffort::class,
            InterruptAgent::class,
            StopAgent::class,
            RunKeyScript::class,
            RetryDriverRequest::class,
            CancelDriverRequest::class,
            ResolveDriverDelivery::class,
            RepairDriverSettings::class,
            ReleaseAgentHold::class,
            ResumeKeyScript::class,
            CancelKeyScript::class,
            ReassignAgentRuntime::class,
            RecordRuntime::class,
            ClaimDriverRequests::class,
            ClaimLaunchGrant::class,
            ReportRuntimeActivity::class,
            ReportRequestProgress::class,
            ReportDriverTurn::class,
            ReportRuntimeHeartbeat::class,
            ReportRuntimeExit::class,
            OpenHostMainRuntime::class,
            RecordHeartbeat::class,
            RecordUserHeartbeat::class,
            MarkSilentSessions::class,
            SettleFrameTimes::class,
            InstallNumbers::class,
            LinkRecords::class,
            UnlinkRecords::class,
            PostComment::class,
            PostTextComment::class,
            SendMessage::class,
            AskMessage::class,
            ReadMessages::class,
            TakeNextMessages::class,
            ReplyToMessage::class,
            ReleaseMessageClaim::class, DismissMessage::class, RequireMessageAnswer::class,
            SetStringSetting::class,
            SetBooleanSetting::class,
            SetIntegerSetting::class,
            SetDecimalSetting::class,
            SetStringChoice::class,
            SetIntegerChoice::class,
            ResetSetting::class,
            EnableSettingGroup::class,
            DisableSettingGroup::class,
            ResetSettingGroup::class,
            SaveSharePreview::class,
            CreateShare::class,
            RequestShare::class,
            ApproveShareRequest::class,
            RevokeShare::class,
            RevokeCommandPermissions::class,
            IssueEvidencePermit::class,
            OpenCommandRequest::class,
            WithdrawCommandRequest::class,
            RefreshShareScope::class,
            RetryShare::class,
            ConfigureShareGateway::class,
            DisableShareGateway::class,
            ReadShare::class,
            ExpireShares::class,
            ClaimGatewayOperation::class,
            RecordGatewayOutcome::class,
            RecordGatewayHealth::class,
            ReopenSharedGateways::class,
            PruneShareAudit::class,
            ActivateProfiles::class,
            InstallBuiltInProfiles::class,
            RevokeProfiles::class,
            LaunchProfileMain::class,
            SwitchAccount::class,
            RenameAccount::class,
            MaintainAccount::class,
            DismissAccountNotice::class,
            BeginSignIn::class,
            BeginSignInAgain::class,
            CancelSignIn::class,
            SubmitSignInCode::class,
            PublishSignInChallenge::class,
            TakeSignInCode::class,
            RecordAccountFailure::class,
            ClaimAccountCheck::class,
            CheckAccount::class,
            ClaimSignIn::class,
            ReportSignIn::class,
            CompleteSignIn::class,
            ExpireSignInAttempt::class,
            ReleaseSignInAgain::class,
            ReconcileAccounts::class,
            ProposeCommandRule::class,
            ReviseRuleProposal::class,
            WithdrawRuleProposal::class,
            ImportRuleProposals::class,
            ProposeReader::class,
            RecordEvidenceReads::class,
            ApproveSample::class,
            StartSample::class,
            SettleSample::class,
            ProveReader::class,
            ApproveRuleProposal::class,
            SaveCommandRule::class,
            RejectRuleProposal::class,
            RetireCommandRule::class,
            RestoreCommandRule::class,
            ApproveRuleBundle::class,
            MarkRunsStale::class,
            AssessPartOutput::class,
            ReadPartLive::class,
            ReplayAssessment::class,
            StopProcessRun::class,
            ReconcileLostRuns::class,
            StopSurvivors::class,
            RetryProcessRun::class,
            CleanProcessOutput::class,
            VerifyRestoredOutput::class,
            CreateSkill::class, ReviseSkill::class, RestoreSkill::class, RetireSkill::class, CopySkill::class,
            RefreshSkills::class,
            PublishSkills::class,
            PrepareSkillPublication::class,
            ActivateSkillPublication::class,
            FailSkillPublication::class,
            RetrySkillPublication::class,
            PruneSkillPublications::class,
            RecordSkillRead::class,
        ];
    }

    /**
     * Core's commands that stay private: registered for Core's own runtime, such as the system's public share read,
     * share expiry and the gateway supervisor's claims and reports, and never exported to a domain or module.
     *
     * @return list<class-string<Command<mixed>>>
     */
    public static function privateCommands(): array
    {
        return [
            InstallBuiltInProfiles::class,
            ReadShare::class,
            ExpireShares::class,
            ClaimGatewayOperation::class,
            RecordGatewayOutcome::class,
            RecordGatewayHealth::class,
            ReopenSharedGateways::class,
            PruneShareAudit::class,
            RefreshSkills::class,
            PublishSkills::class,
            PrepareSkillPublication::class,
            ActivateSkillPublication::class,
            FailSkillPublication::class,
            RetrySkillPublication::class,
            PruneSkillPublications::class,
            RecordSkillRead::class,
            FenceProfileRevision::class,
            ClaimStart::class,
            ReportRunning::class,
            ReportStopped::class,
            ReportFailure::class,
            ReconcileStarts::class,
            PublishSignInChallenge::class,
            TakeSignInCode::class,
            RecordAccountFailure::class,
            ClaimAccountCheck::class,
            CheckAccount::class,
            ClaimSignIn::class,
            ReportSignIn::class,
            CompleteSignIn::class,
            ExpireSignInAttempt::class,
            ReleaseSignInAgain::class,
            ReconcileAccounts::class,
            MarkRunsStale::class,
            ReconcileLostRuns::class,
            StopSurvivors::class,
            ReadPartLive::class,
            ProposeCommandRule::class,
            ReviseRuleProposal::class,
            WithdrawRuleProposal::class,
            ImportRuleProposals::class,
            ProposeReader::class,
            RecordEvidenceReads::class,
            ApproveSample::class,
            StartSample::class,
            SettleSample::class,
            ProveReader::class,
            ApproveRuleProposal::class,
            SaveCommandRule::class,
            RejectRuleProposal::class,
            RetireCommandRule::class,
            RestoreCommandRule::class,
            ApproveRuleBundle::class,
            AssessPartOutput::class,
            ReplayAssessment::class,
            StopProcessRun::class,
            RetryProcessRun::class,
            CleanProcessOutput::class,
            VerifyRestoredOutput::class,
            ClaimLaunchGrant::class,
        ];
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [
            MiddlewareDeclaration::around(RefuseWritesDuringEvaluation::class, CommandScope::all()),
            ...self::launchRefusalAnnouncements(),
            MiddlewareDeclaration::inside(GuardTickOrigin::class, CommandScope::all()),
        ];
    }

    /**
     * Around each launch command's transaction, a launch no account can run is announced to its owner.
     *
     * @return list<MiddlewareDeclaration>
     */
    private static function launchRefusalAnnouncements(): array
    {
        return array_map(
            fn (string $launch) => MiddlewareDeclaration::around(
                AnnounceUnavailableLaunch::class,
                CommandScope::command($launch),
            ),
            [LaunchAgent::class, OpenAgentRuntime::class, ContinueLaunch::class],
        );
    }

    /**
     * Core as an owner of commands: the commands on CoreApi's commands list are exported to the domains; the private
     * ones are not.
     */
    public static function owner(): CommandOwner
    {
        return new CommandOwner(
            name: CommandOwner::CORE,
            namespace: __NAMESPACE__,
            domainClass: CommandOwner::CORE,
            commands: self::commands(),
            middleware: self::middleware(),
            requires: [],
            exports: CoreApi::exports(),
        );
    }
}
