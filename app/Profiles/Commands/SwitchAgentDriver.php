<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Agents\Values\DriverSwitchTarget;
use App\Agents\Values\ModelSelection;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Handlers\SwitchAgentDriverHandler;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\DriverSwitchReceipt;
use App\Profiles\Values\ProfileKey;

/**
 * The owner switches an agent from the session it runs to another driver, variant or account: preflighted first,
 * then the old session stopped, and its replacement started only once the stop is proven. The same request id
 * answers the same switch.
 *
 * @extends Command<DriverSwitchReceipt>
 */
#[HandledBy(SwitchAgentDriverHandler::class)]
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Create)]
final readonly class SwitchAgentDriver extends Command
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
