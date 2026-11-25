<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Commands\Accounts\AddUsageCost\AddUsageCostCommand;
use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Commands\Accounts\ClaimAccountCheck\ClaimAccountCheckCommand;
use App\Commands\Accounts\ClaimCleanup\ClaimCleanupCommand;
use App\Commands\Accounts\ClaimSignIn\ClaimSignInCommand;
use App\Commands\Accounts\CleanAccount\CleanAccountCommand;
use App\Commands\Accounts\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Commands\Accounts\NotifySignIn\NotifySignInCommand;
use App\Commands\Accounts\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Commands\Accounts\ReconcileSignIns\ReconcileSignInsCommand;
use App\Commands\Accounts\RecordAccountFailure\RecordAccountFailureCommand;
use App\Commands\Accounts\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Commands\Accounts\RecordThreadTokens\RecordThreadTokensCommand;
use App\Commands\Accounts\RecordUsageWindow\RecordUsageWindowCommand;
use App\Commands\Accounts\ReleaseAccountRemoval\ReleaseAccountRemovalCommand;
use App\Commands\Accounts\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Commands\Accounts\TakeSignInCode\TakeSignInCodeCommand;
use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\Agents\ClaimStart\ClaimStartCommand;
use App\Commands\Agents\HoldAgentStack\HoldAgentStackCommand;
use App\Commands\Agents\InstallMainAgent\InstallMainAgentCommand;
use App\Commands\Agents\NotifyFailure\NotifyFailureCommand;
use App\Commands\Agents\NotifyRunning\NotifyRunningCommand;
use App\Commands\Agents\RecheckDriverSwitch\RecheckDriverSwitchCommand;
use App\Commands\Agents\ReconcileStarts\ReconcileStartsCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Agents\StartSwitchReplacement\StartSwitchReplacementCommand;
use App\Commands\Agents\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Commands\Asks\AskSupervisor\AskSupervisorCommand;
use App\Commands\Asks\OfferNextAsk\OfferNextAskCommand;
use App\Commands\Asks\ReplyToAsk\ReplyToAskCommand;
use App\Commands\Asks\RouteAsk\RouteAskCommand;
use App\Commands\Asks\WithdrawAsk\WithdrawAskCommand;
use App\Commands\Assignments\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Commands\Assignments\ClaimAutoAssignment\ClaimAutoAssignmentCommand;
use App\Commands\CommandRules\ApproveRuleBundle\ApproveRuleBundleCommand;
use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Commands\CommandRules\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\ProposeReader\ProposeReaderCommand;
use App\Commands\CommandRules\ProposeRuleDeclaration\ProposeRuleDeclarationCommand;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Commands\CommandRules\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Commands\CommandRules\RejectRuleProposal\RejectRuleProposalCommand;
use App\Commands\CommandRules\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use App\Commands\CommandRules\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Commands\CommandRules\SaveCommandAlias\SaveCommandAliasCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Commands\CommandRules\SettleSample\SettleSampleCommand;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Commands\CommandRules\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Commands\Drivers\FailDriverSwitchStart\FailDriverSwitchStartCommand;
use App\Commands\Drivers\NotifyStopped\NotifyStoppedCommand;
use App\Commands\Drivers\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Commands\Notifications\HideUnseatedNotifications\HideUnseatedNotificationsCommand;
use App\Commands\Notifications\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use App\Commands\Notifications\MarkNotificationRead\MarkNotificationReadCommand;
use App\Commands\Notifications\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use App\Commands\Profiles\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Commands\Projects\ClaimProjectReads\ClaimProjectReadsCommand;
use App\Commands\Projects\NotifyProjectRead\NotifyProjectReadCommand;
use App\Commands\Projects\NotifyWorkspaceRead\NotifyWorkspaceReadCommand;
use App\Commands\Projects\RecordHostDescriptors\RecordHostDescriptorsCommand;
use App\Commands\Projects\RecordHostProtection\RecordHostProtectionCommand;
use App\Commands\Projects\RequestProjectRead\RequestProjectReadCommand;
use App\Commands\Runs\AssessPartOutput\AssessPartOutputCommand;
use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Commands\Runs\MarkRunsStale\MarkRunsStaleCommand;
use App\Commands\Runs\ReadPartLive\ReadPartLiveCommand;
use App\Commands\Runs\ReconcileLostRuns\ReconcileLostRunsCommand;
use App\Commands\Runs\RecordRunChunk\RecordRunChunkCommand;
use App\Commands\Runs\RecordRunEvents\RecordRunEventsCommand;
use App\Commands\Runs\ReplayAssessment\ReplayAssessmentCommand;
use App\Commands\Runs\RetryProcessRun\RetryProcessRunCommand;
use App\Commands\Runs\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessCommand;
use App\Commands\Runs\StopLeftoverProcesses\StopLeftoverProcessesCommand;
use App\Commands\Runs\StopProcessRun\StopProcessRunCommand;
use App\Commands\Runs\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Commands\Sessions\HoldProfileRevision\HoldProfileRevisionCommand;
use App\Commands\Sessions\NotifyCleanup\NotifyCleanupCommand;
use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Commands\Sessions\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use App\Commands\Sharing\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Commands\Sharing\ExpireShares\ExpireSharesCommand;
use App\Commands\Sharing\PruneShareAudit\PruneShareAuditCommand;
use App\Commands\Sharing\ReadShare\ReadShareCommand;
use App\Commands\Sharing\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Commands\Sharing\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Commands\Sharing\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Commands\Skills\ActivateSkillPublication\ActivateSkillPublicationCommand;
use App\Commands\Skills\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PruneSkillPublications\PruneSkillPublicationsCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Commands\Skills\RecordSkillRead\RecordSkillReadCommand;
use App\Commands\Skills\RefreshSkills\RefreshSkillsCommand;
use App\Commands\Skills\RetrySkillPublication\RetrySkillPublicationCommand;
use App\Commands\Terminals\RecordScriptStepResult\RecordScriptStepResultCommand;
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

        $commandFiles = glob(app_path('Commands/*/*/*Command.php')) ?: [];

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
            OfferNextAskCommand::class,
            NotifyRunningCommand::class,
            NotifyStoppedCommand::class,
            RecordStopConditionResultsCommand::class,
            NotifyFailureCommand::class,
            ReconcileStartsCommand::class,
            RecordHostProtectionCommand::class,
            RecordHostDescriptorsCommand::class,
            NotifyCleanupCommand::class,
            NotifyWorkspaceReadCommand::class,
            ClaimProjectReadsCommand::class,
            NotifyProjectReadCommand::class,
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
            NotifySignInCommand::class,
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
            FailDriverSwitchStartCommand::class,
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
            HoldProfileRevisionCommand::class,
            MarkRunsStaleCommand::class,
            ReconcileLostRunsCommand::class,
            StopLeftoverProcessesCommand::class,
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
            RouteAskCommand::class,
            WithdrawAskCommand::class,
            HideUnseatedNotificationsCommand::class,
            MarkAllNotificationsReadCommand::class,
            MarkNotificationReadCommand::class,
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
