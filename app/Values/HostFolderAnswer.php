<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Enums\HostOrderStatus;
use App\Models\Hosts\HostOrder;

/**
 * Where a host's account folder order stands: still waiting, done, or refused with the host's reason, and for a
 * folder use whether a container still binds the folder.
 */
final readonly class HostFolderAnswer
{
    public function __construct(public HostOrderStatus $status, public string $reason, public bool $isBound) {}

    public static function of(HostOrder $order): self
    {
        $facts = $order->answer->facts ?? [];
        $reason = $facts['reason'] ?? $order->refusal->value ?? '';

        return new self($order->status, is_string($reason) ? $reason : '', ($facts['is_bound'] ?? false) === true);
    }

    public function isPending(): bool
    {
        return ! $this->isDone() && ! $this->isRefused();
    }

    public function isDone(): bool
    {
        return $this->status === HostOrderStatus::Done;
    }

    public function isRefused(): bool
    {
        return $this->status === HostOrderStatus::Refused;
    }
}
