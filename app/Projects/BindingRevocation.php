<?php

declare(strict_types=1);

namespace App\Projects;

use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectCommandRun;
use App\Projects\Values\BindingOutcome;
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
            return new BindingOutcome($binding->id, BindingOutcome::ALREADY_REVOKED, $binding->revoked_at_text);
        }

        $binding->revoke();
        $binding->host->revokeAt(CarbonImmutable::now());

        foreach (DeviceGrant::findLockedLiveOf($binding) as $grant) {
            $grant->revoke();
        }

        foreach (ProjectCommandRun::findLockedRunningOf($binding) as $run) {
            $run->cancel();
        }

        ConnectionAudit::createForBinding(
            ConnectionAuditType::BindingRevoked,
            ConnectionAuditActor::User,
            $userId,
            $binding,
        );

        return new BindingOutcome($binding->id, BindingOutcome::REVOKED, $binding->revoked_at_text);
    }
}
