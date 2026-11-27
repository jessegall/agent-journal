<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use RuntimeException;

/**
 * protocol/host.json gives a field a type the generator cannot write: not a scalar, an enum or a type of the file.
 */
final class HostFieldTypeUnknown extends RuntimeException
{
    public static function of(string $type): self
    {
        return new self("protocol/host.json names the field type {$type}, which is no scalar, enum or type of the file.");
    }
}
