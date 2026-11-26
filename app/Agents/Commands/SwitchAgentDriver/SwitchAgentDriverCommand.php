<?php

declare(strict_types=1);

namespace App\Agents\Commands\SwitchAgentDriver;

use App\Agents\Enums\AccessType;
use App\Agents\Values\DriverSwitchReceipt;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileAdministrationPolicy;
use App\Support\Command;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileKey;

/**
 * The owner switches an agent from the session it runs to another driver, driver type or account: preflighted first,
 * then the old session stopped, and its replacement started only once the stop is proven. The same request id
 * answers the same switch.
 *
 * @extends Command<DriverSwitchReceipt>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Create)]
final readonly class SwitchAgentDriverCommand extends Command
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public ProfileKey $profile,
        public string $expectedSessionId,
        public int $expectedGeneration,
        public DriverSwitchTarget $target,
        public ModelSelection $requested,
    ) {}
}
