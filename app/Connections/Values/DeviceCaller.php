<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * The terminal sign-in a device grant authenticated: the grant, the binding it is for and the user who approved it,
 * whose own access every verb it runs is checked against.
 */
final readonly class DeviceCaller
{
    public function __construct(
        public string $grantId,
        public string $bindingId,
        public string $userId,
    ) {}
}
