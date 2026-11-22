<?php

declare(strict_types=1);

namespace App\Drivers\Contracts;

use App\Drivers\Values\DriverKey;
use App\Drivers\Values\DriverRegistration;

/**
 * The drivers this journal can start: a lookup by key is the only way one is selected.
 */
interface DriverCatalogue
{
    public function forKey(DriverKey $key): Driver;

    /**
     * @return list<DriverRegistration>
     */
    public function catalogue(): array;

    /**
     * The catalogue's revision, which rises with every registration, so a choice made against an older one can be told.
     */
    public function revision(): int;
}
