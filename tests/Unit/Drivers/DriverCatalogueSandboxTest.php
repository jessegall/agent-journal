<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use Tests\TestCase;

/**
 * Under Octane each request runs in a sandbox of the application; the driver catalogue of a request is built in that
 * sandbox, so the commands its drivers run open their units where the request's rows are written.
 */
final class DriverCatalogueSandboxTest extends TestCase
{
    public function test_a_request_sandbox_builds_its_own_driver_catalogue(): void
    {
        $worker = $this->app->make(DriverCatalogue::class);
        $sandbox = clone $this->app;
        $sandbox->forgetScopedInstances();

        $this->assertNotSame($worker, $sandbox->make(DriverCatalogue::class));
    }
}
