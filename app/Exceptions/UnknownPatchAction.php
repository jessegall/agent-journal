<?php

declare(strict_types=1);

namespace App\Exceptions;

use UnexpectedValueException;

final class UnknownPatchAction extends UnexpectedValueException
{
    public static function forAction(string $action): self
    {
        return new self("A patch names the file action {$action}, which is not Add, Update or Delete.");
    }
}
