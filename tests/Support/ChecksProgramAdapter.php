<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\Drivers\Contracts\DriverAdapter;

/**
 * What the test of one driver's adapter checks beside its fixtures: the model arguments the host starts it with.
 */
trait ChecksProgramAdapter
{
    use ChecksProgramFixtures;

    /**
     * A model the driver is started on.
     */
    abstract protected static function selectedModel(): string;

    abstract private function adapter(): DriverAdapter;

    public function test_the_host_starts_the_program_on_the_selected_model_and_no_actual_model_is_reported(): void
    {
        $model = static::selectedModel();

        $this->assertSame(['--model', $model], $this->adapter()->modelArguments($model));
        $this->assertFalse($this->adapter()->capabilities()->reportsActualModel);
    }
}
