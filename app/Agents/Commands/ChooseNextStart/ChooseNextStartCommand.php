<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChooseNextStart;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileAdministrationPolicy;
use App\Support\Command;
use App\Values\ChosenAccount;

/**
 * The owner switches the driver of an agent that runs no session: nothing starts now, and the agent's next message
 * starts it on this driver, model and account.
 *
 * @extends Command<null>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Create)]
final readonly class ChooseNextStartCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $driver,
        public string $model,
        public ChosenAccount $account,
    ) {}
}
