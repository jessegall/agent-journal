<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use LogicException;

/**
 * A command rule was declared in a shape no rule may have.
 */
final class CommandRuleInvalid extends LogicException
{
    public static function id(string $id): self
    {
        return new self("The command rule id {$id} is not a namespaced id such as core.git.status.");
    }

    public static function contractMissing(string $id): self
    {
        return new self("The command rule {$id} is a test, check or build, so it is declared with forCheck and its contract.");
    }

    public static function contractWithoutCheck(string $id): self
    {
        return new self("The command rule {$id} is no test, check or build, so it carries no verification contract.");
    }

    public static function replacementOutsideProject(string $id): self
    {
        return new self("The command rule {$id} replaces another rule, which only a project rule may do.");
    }
}
