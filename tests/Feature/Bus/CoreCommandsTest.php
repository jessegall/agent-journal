<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Commands\ActivateSkillPublication\ActivateSkillPublicationCommand;
use App\Commands\AddUsageCost\AddUsageCostCommand;
use App\Commands\ApproveCodeReview\ApproveCodeReviewCommand;
use App\Commands\ApproveRuleBundle\ApproveRuleBundleCommand;
use App\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\ApproveSample\ApproveSampleCommand;
use App\Commands\AskSupervisor\AskSupervisorCommand;
use App\Commands\AssessPartOutput\AssessPartOutputCommand;
use App\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Commands\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\CheckAccount\CheckAccountCommand;
use App\Commands\ClaimAccountCheck\ClaimAccountCheckCommand;
use App\Commands\ClaimAutoAssignment\ClaimAutoAssignmentCommand;
use App\Commands\ClaimCleanup\ClaimCleanupCommand;
use App\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Commands\ClaimProjectReads\ClaimProjectReadsCommand;
use App\Commands\ClaimSignIn\ClaimSignInCommand;
use App\Commands\ClaimStart\ClaimStartCommand;
use App\Commands\ClaimStartGrant\ClaimStartGrantCommand;
use App\Commands\CleanAccount\CleanAccountCommand;
use App\Commands\CleanProcessOutput\CleanProcessOutputCommand;
use App\Commands\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Commands\CloseWorkChain\CloseWorkChainCommand;
use App\Commands\CompleteSignIn\CompleteSignInCommand;
use App\Commands\ExpireShares\ExpireSharesCommand;
use App\Commands\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Commands\FailDriverSwitchLaunch\FailDriverSwitchLaunchCommand;
use App\Commands\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\FenceProfileRevision\FenceProfileRevisionCommand;
use App\Commands\HideUnseatedNotifications\HideUnseatedNotificationsCommand;
use App\Commands\HoldAgentStack\HoldAgentStackCommand;
use App\Commands\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Commands\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Commands\InstallMainAgent\InstallMainAgentCommand;
use App\Commands\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use App\Commands\MarkNotificationRead\MarkNotificationReadCommand;
use App\Commands\MarkQuestionNotificationRead\MarkQuestionNotificationReadCommand;
use App\Commands\MarkRunsStale\MarkRunsStaleCommand;
use App\Commands\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use App\Commands\MergeReviewedWork\MergeReviewedWorkCommand;
use App\Commands\OfferNextAsk\OfferNextAskCommand;
use App\Commands\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\ProposeReader\ProposeReaderCommand;
use App\Commands\ProposeRuleDeclaration\ProposeRuleDeclarationCommand;
use App\Commands\ProveReader\ProveReaderCommand;
use App\Commands\PruneShareAudit\PruneShareAuditCommand;
use App\Commands\PruneSkillPublications\PruneSkillPublicationsCommand;
use App\Commands\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Commands\PublishSkills\PublishSkillsCommand;
use App\Commands\ReadPartLive\ReadPartLiveCommand;
use App\Commands\ReadShare\ReadShareCommand;
use App\Commands\RecheckDriverSwitch\RecheckDriverSwitchCommand;
use App\Commands\ReconcileAccounts\ReconcileAccountsCommand;
use App\Commands\ReconcileLostRuns\ReconcileLostRunsCommand;
use App\Commands\ReconcileSignIns\ReconcileSignInsCommand;
use App\Commands\ReconcileStarts\ReconcileStartsCommand;
use App\Commands\RecordAccountFailure\RecordAccountFailureCommand;
use App\Commands\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Commands\RecordHostDescriptors\RecordHostDescriptorsCommand;
use App\Commands\RecordHostProtection\RecordHostProtectionCommand;
use App\Commands\RecordRunChunk\RecordRunChunkCommand;
use App\Commands\RecordRunEvents\RecordRunEventsCommand;
use App\Commands\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Commands\RecordSkillRead\RecordSkillReadCommand;
use App\Commands\RecordStopResults\RecordStopResultsCommand;
use App\Commands\RecordThreadTokens\RecordThreadTokensCommand;
use App\Commands\RecordUsageWindow\RecordUsageWindowCommand;
use App\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use App\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Commands\RejectRuleProposal\RejectRuleProposalCommand;
use App\Commands\ReleaseAccountRemoval\ReleaseAccountRemovalCommand;
use App\Commands\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Commands\ReplayAssessment\ReplayAssessmentCommand;
use App\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Commands\ReportCleanup\ReportCleanupCommand;
use App\Commands\ReportFailure\ReportFailureCommand;
use App\Commands\ReportProjectRead\ReportProjectReadCommand;
use App\Commands\ReportRunning\ReportRunningCommand;
use App\Commands\ReportSignIn\ReportSignInCommand;
use App\Commands\ReportStopped\ReportStoppedCommand;
use App\Commands\ReportWorkspaceRead\ReportWorkspaceReadCommand;
use App\Commands\RequestProjectRead\RequestProjectReadCommand;
use App\Commands\ResolveMergeAttempt\ResolveMergeAttemptCommand;
use App\Commands\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Commands\RetireCommandRule\RetireCommandRuleCommand;
use App\Commands\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Commands\RetryProcessRun\RetryProcessRunCommand;
use App\Commands\RetrySkillPublication\RetrySkillPublicationCommand;
use App\Commands\ReturnCodeReview\ReturnCodeReviewCommand;
use App\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Commands\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessCommand;
use App\Commands\RouteAsk\RouteAskCommand;
use App\Commands\SaveCommandAlias\SaveCommandAliasCommand;
use App\Commands\SaveCommandRule\SaveCommandRuleCommand;
use App\Commands\SaveProfileDraft\SaveProfileDraftCommand;
use App\Commands\SettleSample\SettleSampleCommand;
use App\Commands\StartAgent\StartAgentCommand;
use App\Commands\StartSample\StartSampleCommand;
use App\Commands\StartSwitchReplacement\StartSwitchReplacementCommand;
use App\Commands\StopProcessRun\StopProcessRunCommand;
use App\Commands\StopSurvivors\StopSurvivorsCommand;
use App\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Commands\TakeSignInCode\TakeSignInCodeCommand;
use App\Commands\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Commands\WithdrawWorkChain\WithdrawWorkChainCommand;
use App\CoreCommands;
use App\Support\CommandRegistry;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;

/**
 * Core's own commands: a module uses them without declaring Core, every one but Core's private
 * runtime commands is exported, and a scope owned by Core covers exactly them.
 */
final class CoreCommandsTest extends CommandBusTestCase
{
    private const string EVERY_CLASS = "Every class of a Core Commands folder is one of Core's commands.";

    public function test_core_lists_its_commands_and_exports_them(): void
    {
        $this->installCommandModules();
        $registry = $this->app->make(CommandRegistry::class);

        $commandFiles = glob(app_path('Commands/*/*Command.php')) ?: [];

        $this->assertCount(
            count($commandFiles),
            CoreCommands::commands(),
            self::EVERY_CLASS,
        );
        $this->assertContains(StartAgentCommand::class, CoreCommands::commands());
        $this->assertContains(RecordUserHeartbeatCommand::class, CoreCommands::commands());

        $privateCommands = CoreCommands::privateCommands();

        foreach (CoreCommands::commands() as $command) {
            $this->assertTrue($registry->has($command));
            $this->assertSame(
                ! in_array($command, $privateCommands, true),
                $registry->isExported($command),
                $command,
            );
        }

        $this->assertEqualsCanonicalizing([
            ClaimStartCommand::class,
            HoldAgentStackCommand::class,
            MergeReviewedWorkCommand::class,
            OfferNextAskCommand::class,
            ReportRunningCommand::class,
            ReportStoppedCommand::class,
            RecordStopResultsCommand::class,
            ReportFailureCommand::class,
            ReconcileStartsCommand::class,
            RecordHostProtectionCommand::class,
            RecordHostDescriptorsCommand::class,
            ReportCleanupCommand::class,
            ReportWorkspaceReadCommand::class,
            ClaimProjectReadsCommand::class,
            ReportProjectReadCommand::class,
            RequestProjectReadCommand::class,
            RecordScriptStepResultCommand::class,
            PublishSignInChallengeCommand::class,
            SaveCommandAliasCommand::class,
            TakeSignInCodeCommand::class,
            RecordAccountFailureCommand::class,
            RecordAccountNoticeCommand::class,
            RecordUsageWindowCommand::class,
            AddUsageCostCommand::class,
            RecordThreadTokensCommand::class,
            ClaimAccountCheckCommand::class,
            CheckAccountCommand::class,
            ClaimSignInCommand::class,
            ReportSignInCommand::class,
            CompleteSignInCommand::class,
            ExpireSignInAttemptCommand::class,
            ReleaseAccountRemovalCommand::class,
            ReconcileSignInsCommand::class,
            ClaimCleanupCommand::class,
            CleanAccountCommand::class,
            CleanSignInAttemptCommand::class,
            ReleaseSignInAgainCommand::class,
            ReconcileAccountsCommand::class,
            InstallBuiltInProfilesCommand::class,
            InstallMainAgentCommand::class,
            StartSwitchReplacementCommand::class,
            SwitchAgentDriverCommand::class,
            RecheckDriverSwitchCommand::class,
            RetryDriverSwitchCommand::class,
            FailDriverSwitchLaunchCommand::class,
            ReadShareCommand::class,
            ExpireSharesCommand::class,
            ClaimGatewayOperationCommand::class,
            RecordGatewayOutcomeCommand::class,
            RecordGatewayHealthCommand::class,
            ReopenSharedGatewaysCommand::class,
            PruneShareAuditCommand::class,
            RefreshSkillsCommand::class,
            PublishSkillsCommand::class,
            PrepareSkillPublicationCommand::class,
            ActivateSkillPublicationCommand::class,
            FailSkillPublicationCommand::class,
            RetrySkillPublicationCommand::class,
            PruneSkillPublicationsCommand::class,
            RecordSkillReadCommand::class,
            FenceProfileRevisionCommand::class,
            MarkRunsStaleCommand::class,
            ReconcileLostRunsCommand::class,
            StopSurvivorsCommand::class,
            ReadPartLiveCommand::class,
            ProposeCommandRuleCommand::class,
            ReviseRuleProposalCommand::class,
            WithdrawRuleProposalCommand::class,
            ImportRuleProposalsCommand::class,
            ProposeReaderCommand::class,
            RecordEvidenceReadsCommand::class,
            ApproveSampleCommand::class,
            StartSampleCommand::class,
            SettleSampleCommand::class,
            ProposeRuleDeclarationCommand::class,
            ProveReaderCommand::class,
            ApproveRuleProposalCommand::class,
            SaveCommandRuleCommand::class,
            RejectRuleProposalCommand::class,
            RetireCommandRuleCommand::class,
            RestoreCommandRuleCommand::class,
            ApproveRuleBundleCommand::class,
            AssessPartOutputCommand::class,
            RecordRunChunkCommand::class,
            RecordRunEventsCommand::class,
            ReplayAssessmentCommand::class,
            StopProcessRunCommand::class,
            RetryProcessRunCommand::class,
            CleanProcessOutputCommand::class,
            VerifyRestoredOutputCommand::class,
            ClaimStartGrantCommand::class,
            ClaimAutoAssignmentCommand::class,
            AssignRecordForMaintenanceCommand::class,
            SaveProfileDraftCommand::class,
            AskSupervisorCommand::class,
            ChangeSupervisorCommand::class,
            ReplyToAskCommand::class,
            ApproveCodeReviewCommand::class,
            CloseWorkChainCommand::class,
            WithdrawWorkChainCommand::class,
            ResolveMergeAttemptCommand::class,
            ReturnCodeReviewCommand::class,
            RouteAskCommand::class,
            WithdrawAskCommand::class,
            HideUnseatedNotificationsCommand::class,
            MarkAllNotificationsReadCommand::class,
            MarkNotificationReadCommand::class,
            MarkQuestionNotificationReadCommand::class,
            MarkTargetNotificationReadCommand::class,
            RevokeRunOutcomeAccessCommand::class,
        ], CoreCommands::privateCommands());
    }

    public function test_a_scope_owned_by_core_covers_exactly_cores_commands(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(RecordAll::class, CommandScope::ownedByCore()));
        $registry = $this->app->make(CommandRegistry::class);
        $covered = array_values(array_filter(array_keys($registry->handlerMap()), fn (string $command) => in_array(
            RecordAll::class,
            array_map(fn ($entry) => $entry->middlewareClass(), $registry->middlewareFor($command)),
            true,
        ) && count(
            array_filter(
                $registry->middlewareFor($command),
                fn ($entry) => $entry->middlewareClass() === RecordAll::class,
            ),
        ) === 2));

        sort($covered);
        $expected = CoreCommands::commands();
        sort($expected);

        $this->assertSame($expected, $covered);
    }
}
