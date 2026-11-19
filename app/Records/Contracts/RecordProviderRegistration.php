<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Records\Exceptions\RecordProviderInvalid;

/**
 * Where a domain's record providers are registered at boot, one per link alias.
 */
interface RecordProviderRegistration
{
    /**
     * @param  class-string<RecordProvider>  $providerClass
     *
     * @throws RecordProviderInvalid
     */
    public function register(string $type, string $providerClass): void;
}
