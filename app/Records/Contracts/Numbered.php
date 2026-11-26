<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * A record users refer to by a number within its holder: task 12 within the journal, phase 2 within its plan.
 */
interface Numbered
{
    /**
     * The saved record whose group numbers this one.
     */
    public function numberHolder(): Model;

    /**
     * Gives the record its number within the number group of this id, as it is created.
     */
    public function assignNumber(string $numberGroupId, int $number): void;
}
