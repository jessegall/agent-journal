<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Actors\Contracts\JournalAdmission;
use App\Agents\Enums\ArrangementType;
use App\Agents\Models\Agent;
use App\Agents\Models\Host;
use App\Agents\Support\InstallLineAvailability;
use App\Connections\Commands\RedeemProjectInvitation;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Exceptions\InvitationUnusable;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Values\Redemption;
use App\Contracts\CommandHandler;
use Illuminate\Support\Str;

/**
 * In the bus's one transaction: locks the line by its ticket's digest, refuses it alike when it is not live by server
 * time, its issuer is no longer the owner or connecting is switched off, then makes the host with the relay's
 * credential, the project (or finds the one it joins), the binding and its main agent, and spends the line.
 */
final readonly class RedeemProjectInvitationHandler implements CommandHandler
{
    private const string MAIN_AGENT_PROFILE = 'main-agent';

    public function __construct(private InstallLineAvailability $availability, private JournalAdmission $admission) {}

    public function handle(RedeemProjectInvitation $command): Redemption
    {
        $invitation = ProjectInvitation::lockRedeemableFor($command->ticket);

        $issuerIsOwner = $invitation->issuer_user_id === $this->admission->owner()->actorId();

        if (! $this->availability->canIssue() || ! $issuerIsOwner) {
            throw InvitationUnusable::forTicket();
        }

        $folder = $command->folder;

        $host = Host::create(
            $folder->machineLabel,
            $command->hostCredential,
            [$folder->canonicalRoot],
            ArrangementType::Local,
        );

        $project = $this->projectOf($invitation, $command->projectLabel);
        $mainAgent = Agent::create("{$project->label} main agent", self::MAIN_AGENT_PROFILE);
        $binding = ProjectBinding::create($host, $project, $mainAgent, $folder);
        $invitation->spendOn($binding);
        ConnectionAudit::ofBinding(ConnectionAuditType::Redeemed, ConnectionAuditActor::Host, $host->id, $binding);

        return new Redemption($host->id, $project->id, $binding->id, $mainAgent->id);
    }

    /**
     * The project the line joins, or a new one under a key made from its label.
     */
    private function projectOf(ProjectInvitation $invitation, string $label): Project
    {
        if ($invitation->project_id !== null) {
            return Project::forId($invitation->project_id);
        }

        $slug = Str::slug($label);
        $prefix = $slug === '' ? 'project' : $slug;

        return Project::create($prefix.'-'.Str::lower(Str::random(8)), $label);
    }
}
