<?php

declare(strict_types=1);

namespace App\Events\Asks;

/**
 * A supervisor link's routes changed.
 */
final readonly class SupervisorLinkChanged extends AskEvent
{
    public function __construct(
        public string $linkId,
    ) {}
}
