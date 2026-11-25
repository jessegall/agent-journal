<?php

declare(strict_types=1);

namespace App\Commands\Projects\RecoverProjectBinding;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Connections\ConnectionAuditActor;
use App\Enums\Connections\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\ProjectBinding;
use App\Values\Redemption;

/**
 * Finds the binding of this host's nonce, audits the recovery and answers its identifiers.
 */
final readonly class RecoverProjectBindingHandler implements CommandHandler
{
    public function handle(RecoverProjectBindingCommand $command): Redemption
    {
        $binding = ProjectBinding::ofHostByNonce($command->hostId, $command->installationNonce);

        ConnectionAudit::createForBinding(
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
