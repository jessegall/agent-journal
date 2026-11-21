<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RecoverProjectBinding;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\Redemption;
use App\Contracts\CommandHandler;

/**
 * Finds the binding of this host's nonce, audits the recovery and answers its identifiers.
 */
final readonly class RecoverProjectBindingHandler implements CommandHandler
{
    public function handle(RecoverProjectBinding $command): Redemption
    {
        $binding = ProjectBinding::ofHostByNonce($command->hostId, $command->installationNonce);

        ConnectionAudit::ofBinding(
            ConnectionAuditType::Recovered,
            ConnectionAuditActor::Host,
            $command->hostId,
            $binding,
        );

        return new Redemption(
            $binding->host_id,
            $binding->project_id,
            $binding->id,
            $binding->main_agent_id,
            $binding->project_label,
        );
    }
}
