<?php

declare(strict_types=1);

namespace App\Sessions\Values;

use App\Agents\ContainerManifest;
use App\Hosts\Protocol\Payloads\HostContainerLabelsPayload;

/**
 * The container a contained session's processes run in, and the labels it carries on the agent daemon.
 */
final readonly class SessionContainer
{
    public function __construct(
        public ContainerManifest $manifest,
        public HostContainerLabelsPayload $labels,
    ) {}
}
