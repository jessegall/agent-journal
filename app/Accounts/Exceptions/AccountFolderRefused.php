<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use RuntimeException;

/**
 * The agent host did not make or remove an account folder: it could not be reached, or it said why not.
 */
final class AccountFolderRefused extends RuntimeException
{
    public static function byHost(string $reason): self
    {
        return new self("The agent host did not change the account folder: {$reason}");
    }

    public static function hostUnreachable(): self
    {
        return new self('The agent host could not be reached to change the account folder.');
    }
}
