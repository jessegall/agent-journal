<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Support\AssigneeIdentity;
use App\Desks\Contracts\DestinationProvider;
use App\Desks\Contracts\Destinations;
use App\Registries\Support\Registry;
use Illuminate\Container\Container;

/**
 * The destination provider of each assignee type, registered at boot, and the destinations of a requested recipient
 * through the provider of its type.
 */
final class DestinationRegistry
{
    /**
     * @var Registry<class-string<DestinationProvider>>
     */
    private readonly Registry $providers;

    public function __construct()
    {
        $this->providers = Registry::replacing(AssignmentTypeUnavailable::forType(...));
    }

    /**
     * @param  class-string<DestinationProvider>  $providerClass
     */
    public function register(string $assigneeType, string $providerClass): void
    {
        $this->providers->put($assigneeType, $providerClass);
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        return Container::getInstance()->make($this->providers->get($requested->type))->destinationsFor($requested);
    }
}
