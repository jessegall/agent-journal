<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Agents\Commands\ClaimStart\ClaimStartCommand;
use App\Agents\Commands\ClaimStartGrant\ClaimStartGrantCommand;
use App\Agents\Commands\FailDriverSwitchLaunch\FailDriverSwitchLaunchCommand;
use App\Agents\Commands\FenceProfileRevision\FenceProfileRevisionCommand;
use App\Agents\Commands\MergeReviewedWork\MergeReviewedWorkCommand;
use App\Agents\Commands\RecheckDriverSwitch\RecheckDriverSwitchCommand;
use App\Agents\Commands\ReconcileStarts\ReconcileStartsCommand;
use App\Agents\Commands\RecordHostCombinations\RecordHostCombinationsCommand;
use App\Agents\Commands\RecordHostProtection\RecordHostProtectionCommand;
use App\Agents\Commands\ReportCleanup\ReportCleanupCommand;
use App\Agents\Commands\ReportFailure\ReportFailureCommand;
use App\Agents\Commands\ReportRunning\ReportRunningCommand;
use App\Agents\Commands\ReportStopped\ReportStoppedCommand;
use App\Agents\Commands\ReportWorkspaceRead\ReportWorkspaceReadCommand;
use App\Agents\Commands\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Assignments\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Assignments\Commands\ClaimAutoAssignment\ClaimAutoAssignmentCommand;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Communication\Commands\HideUnseatedNotifications\HideUnseatedNotificationsCommand;
use App\Communication\Commands\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use App\Communication\Commands\MarkNotificationRead\MarkNotificationReadCommand;
use App\Communication\Commands\MarkQuestionNotificationRead\MarkQuestionNotificationReadCommand;
use App\Communication\Commands\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use App\CoreCommands;
use App\Hooks\Commands\RecordStopResults\RecordStopResultsCommand;
use App\Processes\Commands\ApproveRuleBundle\ApproveRuleBundleCommand;
use App\Processes\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Processes\Commands\ApproveSample\ApproveSampleCommand;
use App\Processes\Commands\AssessPartOutput\AssessPartOutputCommand;
use App\Processes\Commands\CleanProcessOutput\CleanProcessOutputCommand;
use App\Processes\Commands\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Processes\Commands\MarkRunsStale\MarkRunsStaleCommand;
use App\Processes\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Processes\Commands\ProposeReader\ProposeReaderCommand;
use App\Processes\Commands\ProveReader\ProveReaderCommand;
use App\Processes\Commands\ReadPartLive\ReadPartLiveCommand;
use App\Processes\Commands\ReconcileLostRuns\ReconcileLostRunsCommand;
use App\Processes\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Processes\Commands\RecordRunChunk\RecordRunChunkCommand;
use App\Processes\Commands\RecordRunEvents\RecordRunEventsCommand;
use App\Processes\Commands\RejectRuleProposal\RejectRuleProposalCommand;
use App\Processes\Commands\ReplayAssessment\ReplayAssessmentCommand;
use App\Processes\Commands\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Processes\Commands\RetireCommandRule\RetireCommandRuleCommand;
use App\Processes\Commands\RetryProcessRun\RetryProcessRunCommand;
use App\Processes\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Processes\Commands\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessCommand;
use App\Processes\Commands\SaveCommandRule\SaveCommandRuleCommand;
use App\Processes\Commands\SettleSample\SettleSampleCommand;
use App\Processes\Commands\StartSample\StartSampleCommand;
use App\Processes\Commands\StopProcessRun\StopProcessRunCommand;
use App\Processes\Commands\StopSurvivors\StopSurvivorsCommand;
use App\Processes\Commands\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Processes\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Profiles\Commands\AddUsageCost\AddUsageCostCommand;
use App\Profiles\Commands\CheckAccount\CheckAccountCommand;
use App\Profiles\Commands\ClaimAccountCheck\ClaimAccountCheckCommand;
use App\Profiles\Commands\ClaimCleanup\ClaimCleanupCommand;
use App\Profiles\Commands\ClaimSignIn\ClaimSignInCommand;
use App\Profiles\Commands\CleanAccount\CleanAccountCommand;
use App\Profiles\Commands\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Profiles\Commands\CompleteSignIn\CompleteSignInCommand;
use App\Profiles\Commands\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Profiles\Commands\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Profiles\Commands\InstallMainAgent\InstallMainAgentCommand;
use App\Profiles\Commands\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Profiles\Commands\ReconcileAccounts\ReconcileAccountsCommand;
use App\Profiles\Commands\ReconcileSignIns\ReconcileSignInsCommand;
use App\Profiles\Commands\RecordAccountFailure\RecordAccountFailureCommand;
use App\Profiles\Commands\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Profiles\Commands\RecordThreadTokens\RecordThreadTokensCommand;
use App\Profiles\Commands\RecordUsageWindow\RecordUsageWindowCommand;
use App\Profiles\Commands\ReleaseAccountRemoval\ReleaseAccountRemovalCommand;
use App\Profiles\Commands\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Profiles\Commands\ReportSignIn\ReportSignInCommand;
use App\Profiles\Commands\SaveProfileDraft\SaveProfileDraftCommand;
use App\Profiles\Commands\StartSwitchReplacement\StartSwitchReplacementCommand;
use App\Profiles\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Profiles\Commands\TakeSignInCode\TakeSignInCodeCommand;
use App\Scripts\Commands\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Sharing\Commands\ExpireShares\ExpireSharesCommand;
use App\Sharing\Commands\PruneShareAudit\PruneShareAuditCommand;
use App\Sharing\Commands\ReadShare\ReadShareCommand;
use App\Sharing\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Sharing\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Skills\Commands\ActivateSkillPublication\ActivateSkillPublicationCommand;
use App\Skills\Commands\FailSkillPublication\FailSkillPublicationCommand;
use App\Skills\Commands\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Skills\Commands\PruneSkillPublications\PruneSkillPublicationsCommand;
use App\Skills\Commands\PublishSkills\PublishSkillsCommand;
use App\Skills\Commands\RecordSkillRead\RecordSkillReadCommand;
use App\Skills\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Skills\Commands\RetrySkillPublication\RetrySkillPublicationCommand;
use App\Supervision\Commands\ApproveCodeReview\ApproveCodeReviewCommand;
use App\Supervision\Commands\AskSupervisor\AskSupervisorCommand;
use App\Supervision\Commands\ChangeSupervisor\ChangeSupervisorCommand;
use App\Supervision\Commands\CloseWorkChain\CloseWorkChainCommand;
use App\Supervision\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Supervision\Commands\ResolveMergeAttempt\ResolveMergeAttemptCommand;
use App\Supervision\Commands\ReturnCodeReview\ReturnCodeReviewCommand;
use App\Supervision\Commands\RouteAsk\RouteAskCommand;
use App\Supervision\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Supervision\Commands\WithdrawWorkChain\WithdrawWorkChainCommand;
use App\Web\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;

/**
 * Core's own commands (doc 19, phase 5): a module uses them without declaring Core, every one but Core's private
 * runtime commands is exported, and a scope owned by Core covers exactly them.
 */
final class CoreCommandsTest extends CommandBusTestCase
{
    private const string EVERY_CLASS = "Every class of a Core Commands folder is one of Core's commands.";

    public function test_core_lists_its_commands_and_exports_them(): void
    {
        $this->installCommandModules();
        $registry = $this->app->make(CommandRegistry::class);

        $commandFiles = glob(app_path('*/Commands/*/*Command.php')) ?: [];

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
            MergeReviewedWorkCommand::class,
            ReportRunningCommand::class,
            ReportStoppedCommand::class,
            RecordStopResultsCommand::class,
            ReportFailureCommand::class,
            ReconcileStartsCommand::class,
            RecordHostProtectionCommand::class,
            RecordHostCombinationsCommand::class,
            ReportCleanupCommand::class,
            ReportWorkspaceReadCommand::class,
            RecordScriptStepResultCommand::class,
            PublishSignInChallengeCommand::class,
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
