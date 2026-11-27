<?php

declare(strict_types=1);

namespace App\Http\Loaders\Accounts;

use App\Accounts\Contracts\StartAccounts;
use App\Accounts\Data\EligibleAccountsData;
use App\Accounts\Data\StartAccountsInput;
use App\Sessions\Contracts\AgentDirectory;

/**
 * The accounts a start of the agent on the chosen driver family may use, with the models its profile permits; an agent
 * the viewer may not see is refused as a missing one.
 */
final readonly class StartAccountsLoader
{
    public function __construct(private AgentDirectory $agents, private StartAccounts $startAccounts) {}

    public function __invoke(StartAccountsInput $input): EligibleAccountsData
    {
        $agent = $this->agents->visibleAgent($input->agent);

        return $this->startAccounts->forProfileStart($input->family, $agent->profileKey);
    }
}
