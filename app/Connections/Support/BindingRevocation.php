<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectCommandRun;
use App\Connections\Values\BindingOutcome;
use Carbon\CarbonImmutable;

/**
 * Revokes one locked binding inside the command that holds it, once: the binding, its host and its device grants, its
 * running command streams ended, and the user who did it audited. A binding revoked already answers the time it was
 * revoked and changes nothing more. Each row changes through its own method.
 */
final readonly class BindingRevocation
{
    public function revoke(ProjectBinding $binding, string $userId): BindingOutcome
    {
        if ($binding->isRevoked()) {
            return new BindingOutcome($binding->id, BindingOutcome::ALREADY_REVOKED, $binding->revokedAtText());
        }

        $binding->revoke();
        $binding->host->revokeAt(CarbonImmutable::now());

        foreach (DeviceGrant::lockLiveOf($binding) as $grant) {
            $grant->revoke();
        }

        foreach (ProjectCommandRun::lockRunningOf($binding) as $run) {
            $run->cancel();
        }

        ConnectionAudit::ofBinding(ConnectionAuditType::BindingRevoked, ConnectionAuditActor::User, $userId, $binding);

        return new BindingOutcome($binding->id, BindingOutcome::REVOKED, $binding->revokedAtText());
    }
}
