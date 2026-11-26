<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * The drivers set up do not match the catalogue: a family set up twice, or a family of the catalogue set up nowhere.
 */
final class DriverSetupInvalid extends LogicException
{
    public static function twice(string $family): self
    {
        return new self("The driver family {$family} is set up twice.");
    }

    public static function accountPartWithoutAccount(string $part): self
    {
        return new self("The account part {$part} was asked for a start with no account.");
    }

    public static function partInWrongList(string $part, string $list): self
    {
        return new self("The part {$part} is declared in the {$list} of a driver setup, which it does not add to.");
    }

    public static function missingFamily(string $family): self
    {
        return new self("The driver family {$family} of the catalogue is set up nowhere.");
    }

    public static function noTurnProcess(string $family): self
    {
        return new self("The driver family {$family} runs its headless turns on an account owner, never one process each.");
    }

    public static function itemWithoutMechanism(string $item): self
    {
        return new self("The isolation table names no mechanism for the boundary item {$item}.");
    }
}
