<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use LogicException;

/**
 * A verification contract was declared with a field no contract may have; the message names the field.
 */
final class VerificationContractInvalid extends LogicException
{
    public static function field(string $field, string $reason): self
    {
        return new self("The verification contract field {$field} is invalid: {$reason}.");
    }
}
