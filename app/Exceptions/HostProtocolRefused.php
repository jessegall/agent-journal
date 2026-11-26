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
 * An order the journal will not make or take: its host was revoked, or its process no longer runs, takes no such
 * order or runs on another host.
 */
final class HostProtocolRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

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

    public static function foreignOrder(string $hostId, string $orderId): self
    {
        return new self("Order {$orderId} is not an order of host {$hostId}.");
    }

    public static function outputTooLarge(string $processId, int $bytes): self
    {
        return new self("Output of process {$processId} is {$bytes} bytes, more than one post may hold.");
    }

    public static function lacksCapability(string $hostId, HostOrderType $order): self
    {
        return new self("Host {$hostId} does not carry out {$order->value} orders; update the host.");
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
