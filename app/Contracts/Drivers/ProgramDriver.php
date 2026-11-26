<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;

/**
 * What drives one program in one process for one worker: it reads what the process prints and the answers to its
 * orders, takes its runtime's requests, and answers each with the commands to run next.
 */
interface ProgramDriver
{
    /**
     * Where the requests a worker before this one had taken stand, rebuilt from the orders it made that were not
     * refused, so no step is ordered twice.
     *
     * @param  list<DriverRequest>  $inFlight
     * @param  list<HostOrder>  $ordered
     */
    public function resume(array $inFlight, array $ordered): DriverActions;

    public function onOutput(FeedEntry $entry): DriverActions;

    public function onRequest(ClaimedRequest $request): DriverActions;

    public function onAnswer(HostOrder $order): DriverActions;

    public function onExit(): DriverActions;
}
