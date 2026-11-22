<?php

declare(strict_types=1);

namespace App\Connections\Commands\RedeemProjectInvitation;

use App\Actors\Contracts\JournalAdmission;
use App\Agents\Enums\ArrangementType;
use App\Agents\Models\Agent;
use App\Agents\Models\Host;
use App\Agents\Support\InstallLineAvailability;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Exceptions\InvitationUnusable;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\Environment;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Values\Redemption;
use App\Contracts\CommandHandler;
use Illuminate\Support\Str;

/**
 * In the bus's one transaction: locks the line by its ticket's digest, refuses it alike when it is not live by server
 * time, its issuer is no longer the owner or connecting is switched off, then makes the host with the relay's
 * credential, the project and its Main environment (or locks the environment of the project it joins), the binding
 * in that environment and its main agent, and spends the line.
 */
final readonly class RedeemProjectInvitationHandler implements CommandHandler
{
    private const string MAIN_AGENT_PROFILE = 'main-agent';

    public function __construct(private InstallLineAvailability $availability, private JournalAdmission $admission) {}

    public function handle(RedeemProjectInvitationCommand $command): Redemption
    {
        $invitation = ProjectInvitation::lockRedeemableFor($command->ticket);

        $issuerIsOwner = $invitation->issuer_user_id === $this->admission->owner()->actorId();

        if (! $this->availability->canIssue() || ! $issuerIsOwner) {
            throw InvitationUnusable::forTicket();
        }

        $attempt = $invitation->lockAttempt();
        $folder = $command->folder;
        $environment = $this->environmentOf($invitation, $command->projectLabel);
        $project = Project::forId($environment->project_id);

        $host = Host::create(
            $folder->machineLabel,
            $command->hostCredential,
            [$folder->canonicalRoot],
            ArrangementType::Local,
        );

        $mainAgent = Agent::create("{$project->label} main agent", self::MAIN_AGENT_PROFILE);
        $binding = ProjectBinding::create($host, $project, $environment, $mainAgent, $folder);
        $invitation->spendOn($binding);
        $attempt->spendOn($binding);
        ConnectionAudit::ofBinding(ConnectionAuditType::Redeemed, ConnectionAuditActor::Host, $host->id, $binding);

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
            return Environment::lockOfProjectForLine((string) $invitation->environment_id, $invitation->project_id);
        }

        $slug = Str::slug($label);
        $prefix = $slug === '' ? 'project' : $slug;

        return Environment::openDefaultOf(Project::create($prefix.'-'.Str::lower(Str::random(8)), $label));
    }
}
