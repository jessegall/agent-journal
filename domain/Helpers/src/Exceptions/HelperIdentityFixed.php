<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use LogicException;

/**
 * A helper identity's profile key and base are fixed when it is declared.
 */
final class HelperIdentityFixed extends LogicException
{
    public static function forIdentity(string $identityId): self
    {
        return new self("Helper identity {$identityId} keeps the profile it was declared with.");
    }
}
