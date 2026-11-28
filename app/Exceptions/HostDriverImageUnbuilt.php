<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A host's driver image was asked for the image its build gave before the build gave one: a fault of the caller,
 * which only asks a row past its build.
 */
final class HostDriverImageUnbuilt extends LogicException
{
    public static function of(string $imageId): self
    {
        return new self("The host's driver image {$imageId} holds no built image yet.");
    }
}
