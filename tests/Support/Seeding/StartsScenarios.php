<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * Starts a shared start position on the journal once all it needs is in place and none of its names is taken; a step
 * that fails puts the actor before it back and fails the test with its own exception.
 */
trait StartsScenarios
{
    /**
     * @template TResult
     *
     * @param  class-string<StartScenario<TResult>>|StartScenario<TResult>  $scenario
     * @return TResult
     */
    public function startScenario(string|StartScenario $scenario): mixed
    {
        $scenario = is_string($scenario) ? new $scenario() : $scenario;
        $this->refuseUnmetScenario($scenario);

        return $this->requests->keepingOnSuccess(fn () => $scenario->start($this));
    }

    /**
     * @param  StartScenario<mixed>  $scenario
     */
    private function refuseUnmetScenario(StartScenario $scenario): void
    {
        $requirements = $scenario->requirements();
        $booted = array_map(
            fn (DomainEntry $domain) => $domain->className(),
            $this->app->make(DomainRegistry::class)->all(),
        );

        foreach ($requirements->domains as $domain) {
            if (! in_array($domain, $booted, true)) {
                throw FixtureRefused::domainNotBooted(class_basename($domain));
            }
        }

        if ($requirements->makesOwner && $this->owner !== null) {
            throw FixtureRefused::secondOwner();
        }

        foreach ($requirements->names as $name) {
            $this->userOrAgentCalled($name);
        }

        foreach ($requirements->sessions as $agent) {
            $this->startOf($agent);
        }

        $fresh = $scenario->freshNames();

        foreach (array_unique(array_diff_assoc($fresh, array_unique($fresh))) as $twice) {
            throw FixtureRefused::freshNameTwice($twice);
        }

        foreach ($fresh as $name) {
            $this->assertNameFree($name);
        }
    }
}
