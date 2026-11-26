<?php

declare(strict_types=1);

namespace App\Projects\Commands\AssertBindingRuntime;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\ProjectBinding;
use App\Projects\Enums\ArrangementType;
use App\Projects\Exceptions\BindingRuntimeRefused;

/**
 * Checks a binding's start against what the binding registered: its host, root id, root folder and main agent, a
 * host enrolled to run agents on the machine itself, and a driver the binding may start; a contained server's
 * arrangement never unlocks native roots.
 */
final readonly class AssertBindingRuntimeHandler implements CommandHandler
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function handle(AssertBindingRuntimeCommand $command): void
    {
        $binding = ProjectBinding::findLockedById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw BindingRuntimeRefused::notTheHost($binding->id);
        }

        if ($binding->isEnvironmentUnassigned()) {
            throw BindingRuntimeRefused::environmentUnassigned($binding->id);
        }

        if (! $binding->isReconciled()) {
            throw BindingRuntimeRefused::notReconciled($binding->id);
        }

        $binding->host->assertEnrolledAs(ArrangementType::Local);

        if (! $binding->isRootOf($command->rootId, $command->folder)) {
            throw BindingRuntimeRefused::notTheRoot($binding->id);
        }

        if ($command->agentId !== $binding->main_agent_id) {
            throw BindingRuntimeRefused::notTheMainAgent($binding->id);
        }

        $eligibility = $binding->eligibilityOf($this->drivers->family($command->driver));

        if (! $eligibility->isEligible()) {
            throw BindingRuntimeRefused::providerUnavailable($binding->id, $eligibility->unavailableReason);
        }
    }
}
