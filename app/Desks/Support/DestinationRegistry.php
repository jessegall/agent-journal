<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Support\AssigneeIdentity;
use App\Desks\Contracts\DestinationProvider;
use App\Desks\Contracts\Destinations;
use Illuminate\Contracts\Container\Container;

/**
 * The destination provider of each assignee type, registered at boot, and the destinations of a requested recipient
 * through the provider of its type.
 */
final class DestinationRegistry
{
    /**
     * @var array<string, class-string<DestinationProvider>>
     */
    private array $providers = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<DestinationProvider>  $providerClass
     */
    public function register(string $assigneeType, string $providerClass): void
    {
        $this->providers[$assigneeType] = $providerClass;
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        $providerClass = $this->providers[$requested->type] ?? throw AssignmentTypeUnavailable::forType($requested->type);

        return $this->container->make($providerClass)->destinationsFor($requested);
    }
}
