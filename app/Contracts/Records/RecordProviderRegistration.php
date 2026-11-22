<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Exceptions\RecordProviderInvalid;

/**
 * Where a domain's record providers are registered at boot, one per link alias.
 */
interface RecordProviderRegistration
{
    /**
     * @param  string  $providerClass  a class name, refused unless it is a RecordProvider
     *
     * @throws RecordProviderInvalid
     */
    public function register(string $type, string $providerClass): void;
}
