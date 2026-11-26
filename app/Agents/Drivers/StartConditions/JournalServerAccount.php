<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start on an account that loads the journal's MCP server.
 *
 * @implements Condition<DriverStart>
 */
final readonly class JournalServerAccount implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->account?->loadsJournalServer() === true;
    }
}
