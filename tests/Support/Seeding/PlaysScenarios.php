<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use Closure;
use Tests\Support\Recordings\TestScenario;

/**
 * Plays a recorded scenario through the test journal: the real host against a Docker daemon played from the
 * recording, the scenario's steps run as the owner, and every call the recording does not hold a failure.
 */
trait PlaysScenarios
{
    /**
     * The scope acts on the recorded scenario, named as <driver>/<name>.
     *
     * @param  Closure(TestScenario): mixed  $scope
     */
    public function scenario(string $name, Closure $scope): self
    {
        $scope(new TestScenario($this, $name));

        return $this;
    }
}
