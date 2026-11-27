<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Protocol\Data\HostFolderUseReplyData;
use App\Hosts\Protocol\HostOrderType;
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
        // Only a folder use answers whether the folder is bound; a made or removed folder answers that it is done.
        if ($order->status === HostOrderStatus::Done && $order->type === HostOrderType::FolderUse) {
            $reply = HostFolderUseReplyData::from($order->answer->facts ?? []);

            return new self($order->status, $reply->reason ?? '', $reply->isBound);
        }

        if ($order->status === HostOrderStatus::Done) {
            return new self($order->status, '', false);
        }

        return new self($order->status, $order->answer->reason ?? $order->refusal->value ?? '', false);
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
