<?php

declare(strict_types=1);

namespace App\Numbers\Contracts;

use App\Numbers\Models\NumberGroup;
use Illuminate\Database\Eloquent\Model;

/**
 * A record people refer to by a number within its holder: task 12 within the journal, phase 2 within its plan.
 */
interface Numbered
{
    /**
     * The saved record whose group numbers this one.
     */
    public function numberHolder(): Model;

    public function assignNumber(NumberGroup $group, int $number): void;
}
