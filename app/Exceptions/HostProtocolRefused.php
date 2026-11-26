<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessType;
use RuntimeException;

/**
 * An order the journal will not make: its host speaks another protocol or was revoked, or its process no longer runs
 * or takes no such input.
 */
final class HostProtocolRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function unsupported(string $hostId, int $protocol): self
    {
        return new self("Host {$hostId} speaks host protocol {$protocol}, which this journal does not order.");
    }

    public static function revoked(string $hostId): self
    {
        return new self("Host {$hostId} is revoked and takes no orders.");
    }

    public static function notRunning(string $processId): self
    {
        return new self("Process {$processId} no longer runs.");
    }

    public static function unsuited(string $processId, HostOrderType $order, HostProcessType $type): self
    {
        return new self("Process {$processId} is a {$type->value} process, which takes no {$order->value} order.");
    }

    public static function foreignProcess(string $hostId, string $processId): self
    {
        return new self("Process {$processId} does not run on host {$hostId}.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
