<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

/**
 * A helper identity was designated for its profile.
 */
final readonly class HelperDesignated extends HelperEvent
{
    public function __construct(
        public string $identityId,
    ) {}
}
