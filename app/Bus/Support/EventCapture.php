<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Contracts\EventSource;
use Illuminate\Database\Eloquent\Model;

/**
 * Opens a slot in the unit active for a saved or deleted event source's connection; with no unit it does nothing. It
 * never dispatches and never drains, so a lifecycle observer that reenters a business mutation between a save and
 * its raise would break the save order, and none may.
 */
final readonly class EventCapture
{
    public function __construct(private ActiveEventUnits $units) {}

    public function persisted(Model&EventSource $row): void
    {
        $this->units->activeFor($row->getConnection())?->openSlot($row);
    }
}
