<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Loaders;

use App\Accounts\Contracts\StartAccounts;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Sessions\Contracts\AgentDirectory;
use Domain\Chat\Data\DriverChoiceData;
use Domain\Chat\Data\StartDriversData;
use Domain\Chat\Data\StartDriversInput;

/**
 * The drivers an agent's start form offers, read where the form opens, so every page that shows the form has them.
 */
final readonly class StartDriversLoader
{
    public function __construct(
        private AgentDirectory $agents,
        private DriverCatalogue $drivers,
        private StartAccounts $startAccounts,
    ) {}

    public function __invoke(StartDriversInput $input): StartDriversData
    {
        $this->agents->visibleAgent($input->agent);

        return new StartDriversData(DriverChoiceData::listed($this->drivers, $this->startAccounts->familiesWithAccounts()));
    }
}
