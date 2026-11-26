<?php

declare(strict_types=1);

namespace Tests\Fixtures\Drivers;

use App\Agents\Drivers\Contracts\DriverCompatibilities;
use App\Agents\Drivers\Enums\DriverEvidence;
use App\Support\Compatibility\DriverCompatibility;

/**
 * Every pinned driver as if its way of sharing an account's sign-in was shown on the real driver.
 */
final class ShownDriverArrangements implements DriverCompatibilities
{
    public function for(string $driver): DriverCompatibility
    {
        return DriverCompatibility::pinned($driver)->withEvidence(DriverEvidence::NativeShown, 'the test journal');
    }
}
