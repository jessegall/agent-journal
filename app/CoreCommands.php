<?php

declare(strict_types=1);

namespace App;

use App\Agents\CommandMiddleware\AnnounceUnavailableStart;
use App\Agents\Commands\ClaimStart;
use App\Agents\Commands\ClaimStartGrant;
use App\Agents\Commands\ContinueStart;
use App\Agents\Commands\FenceProfileRevision;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\ReconcileStarts;
use App\Agents\Commands\ReportFailure;
use App\Agents\Commands\ReportRunning;
use App\Agents\Commands\ReportStopped;
use App\Agents\Commands\StartAgent;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Engine\CommandMiddleware\GuardTickOrigin;
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
use App\Profiles\Commands\ReleaseAccountRemoval;
use App\Profiles\Commands\ReleaseSignInAgain;
use App\Profiles\Commands\ReportSignIn;
use App\Profiles\Commands\TakeSignInCode;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\PruneShareAudit;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Commands\ReopenSharedGateways;
use App\Skills\CommandMiddleware\RefuseWritesDuringEvaluation;
use App\Skills\Commands\ActivateSkillPublication;
use App\Skills\Commands\FailSkillPublication;
use App\Skills\Commands\PrepareSkillPublication;
use App\Skills\Commands\PruneSkillPublications;
use App\Skills\Commands\PublishSkills;
use App\Skills\Commands\RecordSkillRead;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Commands\RetrySkillPublication;

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
        return FolderClasses::in(__DIR__.'/*/Commands', Command::class);
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
            ReplayAssessment::class,
            StopProcessRun::class,
            RetryProcessRun::class,
            CleanProcessOutput::class,
            VerifyRestoredOutput::class,
            ClaimStartGrant::class,
        ];
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [
            MiddlewareDeclaration::around(RefuseWritesDuringEvaluation::class, CommandScope::all()),
            ...self::startRefusalAnnouncements(),
            MiddlewareDeclaration::inside(GuardTickOrigin::class, CommandScope::all()),
        ];
    }

    /**
     * Around each start command's transaction, a start no account can run is announced to its owner.
     *
     * @return list<MiddlewareDeclaration>
     */
    private static function startRefusalAnnouncements(): array
    {
        return array_map(
            fn (string $start) => MiddlewareDeclaration::around(
                AnnounceUnavailableStart::class,
                CommandScope::command($start),
            ),
            [StartAgent::class, OpenAgentRuntime::class, ContinueStart::class],
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
