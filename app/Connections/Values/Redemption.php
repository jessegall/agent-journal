<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What one redemption of an install line made: the host, the project and the binding of the folder.
 */
final readonly class Redemption
{
    public function __construct(public string $hostId, public string $projectId, public string $bindingId) {}
}
