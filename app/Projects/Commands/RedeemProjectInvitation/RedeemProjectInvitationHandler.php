<?php

declare(strict_types=1);

namespace App\Projects\Commands\RedeemProjectInvitation;

use App\Access\Contracts\JournalAdmission;
use App\Actors\Contracts\ActorProvisioning;
use App\Bus\Contracts\CommandHandler;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\InstallLineAvailability;
use App\Models\Agents\Agent;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectInvitation;
use App\Projects\Enums\ArrangementType;
use App\Projects\Exceptions\InvitationUnusable;
use App\Projects\Values\Redemption;
use App\Support\ActorReference;
use Illuminate\Support\Str;

/**
 * Redeems an install line in one transaction: it locks the line by its ticket's digest and refuses it when it is not
 * live, its issuer is not the owner or connecting is off; then it makes the host, the project and its environment, the
 * binding and its main agent, and spends the line.
 */
final readonly class RedeemProjectInvitationHandler implements CommandHandler
{
    private const string MAIN_AGENT_PROFILE = 'main-agent';

    public function __construct(
        private InstallLineAvailability $availability,
        private JournalAdmission $admission,
        private ActorProvisioning $desks,
    ) {}

    public function handle(RedeemProjectInvitationCommand $command): Redemption
    {
        $invitation = ProjectInvitation::findLockedRedeemableFor($command->ticket);

        $issuerIsOwner = $invitation->issuer_user_id === $this->admission->owner()->actorId();

        if (! $this->availability->canIssue() || ! $issuerIsOwner) {
            throw InvitationUnusable::forTicket();
        }

        $attemptId = $invitation->attemptId();
        $attempt = InstallAttempt::findLockedById($attemptId);
        $folder = $command->folder;
        $environment = $this->environmentOf($invitation, $command->projectLabel);
        $project = Project::findForId($environment->project_id);

        $host = Host::create(
            $folder->machineLabel,
            $command->hostCredential,
            [$folder->canonicalRoot],
            ArrangementType::Local,
        );

        $mainAgent = Agent::create("{$project->label} main agent", self::MAIN_AGENT_PROFILE, $project);
        $this->desks->provision(ActorReference::of($mainAgent), $mainAgent->name);
        $binding = ProjectBinding::create($host, $project, $environment, $mainAgent, $folder);
        $invitation->spendOn($binding);
        $attempt->spendOn($binding);

        ConnectionAudit::createForBinding(
            ConnectionAuditType::Redeemed,
            ConnectionAuditActor::Host,
            $host->id,
            $binding,
        );

        return new Redemption($host->id, $project->id, $binding->id, $mainAgent->id, $project->label);
    }

    /**
     * The environment the binding lands in: the one a Join line names, re-read under lock in the project it joins,
     * or the Main environment of a new project under a key made from its label. A Join line whose environment is
     * gone, or that names none, is unusable and stays unspent; it never falls back to a default.
     *
     * @throws InvitationUnusable
     */
    private function environmentOf(ProjectInvitation $invitation, string $label): Environment
    {
        if ($invitation->project_id !== null) {
            return Environment::findLockedOfProjectForLine(
                (string) $invitation->environment_id,
                $invitation->project_id,
            );
        }

        $slug = Str::slug($label);
        $prefix = $slug === '' ? 'project' : $slug;

        return Environment::createForDefault(Project::create($prefix.'-'.Str::lower(Str::random(8)), $label));
    }
}
