<?php

declare(strict_types=1);

namespace App;

use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Commands\FenceProfileRevision;
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
use App\Profiles\Commands\InstallBuiltInProfiles;
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
            MiddlewareDeclaration::inside(GuardTickOrigin::class, CommandScope::all()),
        ];
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
