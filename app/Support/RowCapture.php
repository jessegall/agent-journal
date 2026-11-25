<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Events\EventSource;
use App\Contracts\Reads\RowCapture as RowCaptureContract;
use App\Exceptions\RaisedOutsideUnit;
use Illuminate\Database\Eloquent\Model;

/**
 * Opens a slot in the unit active for a saved or deleted event source's connection; with no unit it refuses, unless
 * writes outside commands are allowed (the seeder and the tests), where the facts stay on the instance. It
 * never dispatches and never drains, so a lifecycle observer that reenters a business mutation between a save and
 * its raise would break the save order, and none may.
 */
final readonly class RowCapture implements RowCaptureContract
{
    public function __construct(private ActiveEventUnits $units, private OutsideCommandAllowance $outsideCommands) {}

    /**
     * @throws RaisedOutsideUnit
     */
    public function persisted(Model&EventSource $row): void
    {
        $active = $this->units->activeFor($row->getConnection());

        if ($active->isEmpty() && ! $this->outsideCommands->isAllowed()) {
            throw RaisedOutsideUnit::for($row::class);
        }

        $active->forAll(fn (EventUnit $unit) => $unit->openSlot($row));
    }
}
