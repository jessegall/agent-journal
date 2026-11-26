<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Exceptions\RaisedOutsideUnit;
use App\Contracts\Events\EventSource;
use App\Reads\Contracts\RowCapture as RowCaptureContract;
use App\Support\ActiveEventUnits;
use Illuminate\Database\Eloquent\Model;

/**
 * Opens a slot in the active unit of a saved or deleted event source's connection; with no unit it refuses, unless the
 * seeder or a test's own seeding allows writes outside commands. It never dispatches and never drains, so no lifecycle
 * observer may run a business mutation between a save and its raise.
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
