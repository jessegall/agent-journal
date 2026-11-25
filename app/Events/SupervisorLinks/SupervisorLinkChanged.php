<?php

declare(strict_types=1);

namespace App\Events\SupervisorLinks;

/**
 * A supervisor link's routes changed.
 */
final readonly class SupervisorLinkChanged implements SupervisorLinkEvent
{
    public function __construct(
        public string $linkId,
    ) {}
}
