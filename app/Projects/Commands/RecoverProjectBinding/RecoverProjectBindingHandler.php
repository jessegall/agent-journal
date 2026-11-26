<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecoverProjectBinding;

use App\Bus\Contracts\CommandHandler;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\ProjectBinding;
use App\Projects\Values\Redemption;

/**
 * Finds the binding of this host's nonce, audits the recovery and answers its identifiers.
 */
final readonly class RecoverProjectBindingHandler implements CommandHandler
{
    public function handle(RecoverProjectBindingCommand $command): Redemption
    {
        $binding = ProjectBinding::findForHostByNonce($command->hostId, $command->installationNonce);

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
