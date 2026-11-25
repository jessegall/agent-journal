<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

/**
 * A helper identity was designated for its profile.
 */
final readonly class HelperDesignated implements HelperEvent
{
    public function __construct(
        public string $identityId,
    ) {}
}
