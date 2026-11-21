<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Agents\Enums\ArrangementType;
use App\Connections\Commands\AssertBindingStart;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Exceptions\BindingStartRefused;
use App\Connections\Models\ProjectBinding;
use App\Contracts\CommandHandler;

/**
 * Checks a binding's start against what the binding registered: its host, root id, root folder and main agent, and
 * a host enrolled to run agents on the machine itself; a contained server's arrangement never unlocks native roots.
 */
final readonly class AssertBindingStartHandler implements CommandHandler
{
    public function handle(AssertBindingStart $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw BindingStartRefused::notTheHost($binding->id);
        }

        if ($binding->readiness === BindingReadiness::Incompatible) {
            throw BindingStartRefused::incompatible($binding->id);
        }

        $binding->host->assertEnrolledAs(ArrangementType::Local);

        if ($command->rootId !== $binding->root_id
            || $command->folder !== $binding->canonical_root
            || ! $binding->host->permitsFolder($command->folder)) {
            throw BindingStartRefused::notTheRoot($binding->id);
        }

        if ($command->agentId !== $binding->main_agent_id) {
            throw BindingStartRefused::notTheMainAgent($binding->id);
        }
    }
}
