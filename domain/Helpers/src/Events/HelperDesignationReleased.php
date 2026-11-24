<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

/**
 * A helper identity's designation was released.
 */
final readonly class HelperDesignationReleased extends HelperEvent
{
    public function __construct(
        public string $identityId,
    ) {}
}
