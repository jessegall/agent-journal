<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Drivers\Contracts\DriverAdapter;

/**
 * What the test of one driver's adapter checks beside its fixtures: that it reports no actual model.
 */
trait ChecksProgramAdapter
{
    use ChecksProgramFixtures;

    abstract private function adapter(): DriverAdapter;

    public function test_no_actual_model_is_reported(): void
    {
        $this->assertFalse($this->adapter()->capabilities()->reportsActualModel);
    }
}
