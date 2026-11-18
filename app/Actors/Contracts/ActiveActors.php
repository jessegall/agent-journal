<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActiveActorsUnavailable;
use App\Actors\Values\ActiveActorsSnapshot;

/**
 * How many actors are present now, read as one coherent snapshot at one database time.
 */
interface ActiveActors
{
    /**
     * @throws ActiveActorsUnavailable
     */
    public function snapshot(): ActiveActorsSnapshot;
}
