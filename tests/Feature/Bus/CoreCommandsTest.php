<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Agents\Commands\ClaimStart;
use App\Agents\Commands\ClaimStartGrant;
use App\Agents\Commands\FenceProfileRevision;
use App\Agents\Commands\MergeReviewedWork;
use App\Agents\Commands\ReconcileStarts;
use App\Agents\Commands\RecordHostProtection;
use App\Agents\Commands\ReportCleanup;
use App\Agents\Commands\ReportFailure;
use App\Agents\Commands\ReportRunning;
use App\Agents\Commands\ReportStopped;
use App\Agents\Commands\ReportWorkspaceRead;
use App\Agents\Commands\StartAgent;
use App\Assignments\Commands\AssignRecordForMaintenance;
use App\Assignments\Commands\ClaimAutoAssignment;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\CoreCommands;
use App\Hooks\Commands\RecordStopResults;
use App\Processes\Commands\ApproveRuleBundle;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Commands\ApproveSample;
use App\Processes\Commands\AssessPartOutput;
use App\Processes\Commands\CleanProcessOutput;
use App\Processes\Commands\ImportRuleProposals;
use App\Processes\Commands\MarkRunsStale;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Commands\ProposeReader;
use App\Processes\Commands\ProveReader;
use App\Processes\Commands\ReadPartLive;
use App\Processes\Commands\ReconcileLostRuns;
use App\Processes\Commands\RecordEvidenceReads;
use App\Processes\Commands\RecordRunChunk;
use App\Processes\Commands\RecordRunEvents;
use App\Processes\Commands\RejectRuleProposal;
use App\Processes\Commands\ReplayAssessment;
use App\Processes\Commands\RestoreCommandRule;
use App\Processes\Commands\RetireCommandRule;
use App\Processes\Commands\RetryProcessRun;
use App\Processes\Commands\ReviseRuleProposal;
use App\Processes\Commands\SaveCommandRule;
use App\Processes\Commands\SettleSample;
use App\Processes\Commands\StartSample;
use App\Processes\Commands\StopProcessRun;
use App\Processes\Commands\StopSurvivors;
use App\Processes\Commands\VerifyRestoredOutput;
use App\Processes\Commands\WithdrawRuleProposal;
use App\Profiles\Commands\CheckAccount;
use App\Profiles\Commands\ClaimAccountCheck;
use App\Profiles\Commands\ClaimCleanup;
use App\Profiles\Commands\ClaimSignIn;
use App\Profiles\Commands\CleanAccount;
use App\Profiles\Commands\CleanSignInAttempt;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Commands\ExpireSignInAttempt;
use App\Profiles\Commands\InstallBuiltInProfiles;
use App\Profiles\Commands\PublishSignInChallenge;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Commands\ReconcileSignIns;
use App\Profiles\Commands\RecordAccountFailure;
use App\Profiles\Commands\RecordAccountNotice;
use App\Profiles\Commands\ReleaseAccountRemoval;
use App\Profiles\Commands\ReleaseSignInAgain;
use App\Profiles\Commands\ReportSignIn;
use App\Profiles\Commands\SaveProfileDraft;
use App\Profiles\Commands\TakeSignInCode;
use App\Scripts\Commands\RecordScriptStepResult;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\PruneShareAudit;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Commands\ReopenSharedGateways;
use App\Skills\Commands\ActivateSkillPublication;
use App\Skills\Commands\FailSkillPublication;
use App\Skills\Commands\PrepareSkillPublication;
use App\Skills\Commands\PruneSkillPublications;
use App\Skills\Commands\PublishSkills;
use App\Skills\Commands\RecordSkillRead;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Commands\RetrySkillPublication;
use App\Supervision\Commands\ApproveCodeReview;
use App\Supervision\Commands\AskSupervisor;
use App\Supervision\Commands\ChangeSupervisor;
use App\Supervision\Commands\CloseWorkChain;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Commands\ResolveMergeAttempt;
use App\Supervision\Commands\ReturnCodeReview;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Commands\WithdrawAsk;
use App\Supervision\Commands\WithdrawWorkChain;
use App\Web\Commands\RecordUserHeartbeat;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;

/**
 * Core's own commands (doc 19, phase 5): a module uses them without declaring Core, every one but Core's private
 * runtime commands is exported, and a scope owned by Core covers exactly them.
 */
final class CoreCommandsTest extends CommandBusTestCase
{
    public function test_core_lists_its_commands_and_exports_them(): void
    {
        $this->installCommandModules();
        $registry = $this->app->make(CommandRegistry::class);

        $commandFiles = glob(app_path('*/Commands/*.php')) ?: [];

        $this->assertCount(
            count($commandFiles),
            CoreCommands::commands(),
            'Every class of a Core Commands folder is one of Core\'s commands.',
        );
        $this->assertContains(StartAgent::class, CoreCommands::commands());
        $this->assertContains(RecordUserHeartbeat::class, CoreCommands::commands());

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
            ClaimStart::class,
            MergeReviewedWork::class,
            ReportRunning::class,
            ReportStopped::class,
            RecordStopResults::class,
            ReportFailure::class,
            ReconcileStarts::class,
            RecordHostProtection::class,
            ReportCleanup::class,
            ReportWorkspaceRead::class,
            RecordScriptStepResult::class,
            PublishSignInChallenge::class,
            TakeSignInCode::class,
            RecordAccountFailure::class,
            RecordAccountNotice::class,
            ClaimAccountCheck::class,
            CheckAccount::class,
            ClaimSignIn::class,
            ReportSignIn::class,
            CompleteSignIn::class,
            ExpireSignInAttempt::class,
            ReleaseAccountRemoval::class,
            ReconcileSignIns::class,
            ClaimCleanup::class,
            CleanAccount::class,
            CleanSignInAttempt::class,
            ReleaseSignInAgain::class,
            ReconcileAccounts::class,
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
            RecordRunChunk::class,
            RecordRunEvents::class,
            ReplayAssessment::class,
            StopProcessRun::class,
            RetryProcessRun::class,
            CleanProcessOutput::class,
            VerifyRestoredOutput::class,
            ClaimStartGrant::class,
            ClaimAutoAssignment::class,
            AssignRecordForMaintenance::class,
            SaveProfileDraft::class,
            AskSupervisor::class,
            ChangeSupervisor::class,
            ReplyToAsk::class,
            ApproveCodeReview::class,
            CloseWorkChain::class,
            WithdrawWorkChain::class,
            ResolveMergeAttempt::class,
            ReturnCodeReview::class,
            RouteAsk::class,
            WithdrawAsk::class,
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
