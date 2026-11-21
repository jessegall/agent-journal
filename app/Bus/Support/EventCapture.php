<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\RaisedOutsideUnit;
use App\Contracts\EventSource;
use Illuminate\Database\Eloquent\Model;

/**
 * Opens a slot in the unit active for a saved or deleted event source's connection; with no unit it refuses, unless
 * writes outside commands are allowed (the seeder and the tests), where the facts stay on the instance. It
 * never dispatches and never drains, so a lifecycle observer that reenters a business mutation between a save and
 * its raise would break the save order, and none may.
 */
final readonly class EventCapture
{
    public function __construct(private ActiveEventUnits $units, private WritesOutsideCommands $outsideCommands) {}

    /**
     * @throws RaisedOutsideUnit
     */
    public function persisted(Model&EventSource $row): void
    {
        $unit = $this->units->activeFor($row->getConnection());

        if ($unit === null && ! $this->outsideCommands->isAllowed()) {
            throw RaisedOutsideUnit::for($row::class);
        }

        $unit?->openSlot($row);
    }
}
