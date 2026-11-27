<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Fixtures;

use Closure;
use Domain\Plans\Enums\PlanStatus;

/**
 * A plan the test named, acted on in its own scope: its phases are added in it and reached by their names.
 */
final readonly class TestPlan
{
    public function __construct(private PlanFixtures $plans, private string $name) {}

    /**
     * A new phase of the plan under the name, titled as given or by its name.
     */
    public function addPhase(string $name, string|null $title = null): self
    {
        $this->plans->addPhaseTo($this->name, $name, $title);

        return $this;
    }

    /**
     * The phase of this name, handed to the scope.
     *
     * @param  Closure(TestPhase): mixed  $scope
     */
    public function withPhase(string $name, Closure $scope): self
    {
        $this->plans->withPhase($name, $scope);

        return $this;
    }

    public function assertStatus(PlanStatus $status): self
    {
        $this->plans->assertStatus($this->name, $status);

        return $this;
    }
}
