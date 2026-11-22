<?php

declare(strict_types=1);

namespace App\Commands\RecoverProjectBinding;

use App\Contracts\CommandHandler;
use App\Enums\ConnectionAuditActor;
use App\Enums\ConnectionAuditType;
use App\Models\ConnectionAudit;
use App\Models\ProjectBinding;
use App\Values\Redemption;

/**
 * Finds the binding of this host's nonce, audits the recovery and answers its identifiers.
 */
final readonly class RecoverProjectBindingHandler implements CommandHandler
{
    public function handle(RecoverProjectBindingCommand $command): Redemption
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
