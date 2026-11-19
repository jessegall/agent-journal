<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A navigation request the host asked for that cannot be raised.
 */
final class NavigationRaiseRefused extends RuntimeException implements CommandRefusal
{
    public static function notAKeyScript(string $requestId): self
    {
        return new self("Request {$requestId} runs no key script, so it has no goal to navigate to.");
    }

    public static function unknownRequest(string $navigationId): self
    {
        return new self("There is no navigation request {$navigationId}.");
    }

    public static function unknownEntry(string $entryId): self
    {
        return new self("There is no menu entry {$entryId}.");
    }

    public static function notOfRuntime(string $requestId, string $runtimeId): self
    {
        return new self("Request {$requestId} is not a request of runtime {$runtimeId}.");
    }

    public static function tooManyRows(int $rows, int $most): self
    {
        return new self("A raised screen of {$rows} rows is longer than the {$most} rows a navigation request keeps.");
    }

    public static function rowTooLong(int $row, int $most): self
    {
        return new self("Row {$row} of the raised screen is longer than {$most} characters.");
    }

    public static function fingerprintMalformed(string $fingerprint): self
    {
        return new self("The fingerprint {$fingerprint} is not fp1: and 64 hexadecimal characters.");
    }
}
