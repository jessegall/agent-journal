<?php

declare(strict_types=1);

namespace App\Commands\Projects\AssertBindingStart;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Projects\ArrangementType;
use App\Exceptions\BindingStartRefused;
use App\Models\Projects\ProjectBinding;

/**
 * Checks a binding's start against what the binding registered: its host, root id, root folder and main agent, a
 * host enrolled to run agents on the machine itself, and a driver the binding may start; a contained server's
 * arrangement never unlocks native roots.
 */
final readonly class AssertBindingStartHandler implements CommandHandler
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function handle(AssertBindingStartCommand $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw BindingStartRefused::notTheHost($binding->id);
        }

        if ($binding->isEnvironmentUnassigned()) {
            throw BindingStartRefused::environmentUnassigned($binding->id);
        }

        if (! $binding->isReconciled()) {
            throw BindingStartRefused::notReconciled($binding->id);
        }

        $binding->host->assertEnrolledAs(ArrangementType::Local);

        if (! $binding->isRootOf($command->rootId, $command->folder)) {
            throw BindingStartRefused::notTheRoot($binding->id);
        }

        if ($command->agentId !== $binding->main_agent_id) {
            throw BindingStartRefused::notTheMainAgent($binding->id);
        }

        $eligibility = $binding->eligibilityOf($this->drivers->family($command->driver));

        if (! $eligibility->isEligible()) {
            throw BindingStartRefused::providerUnavailable($binding->id, $eligibility->unavailableReason);
        }
    }
}
