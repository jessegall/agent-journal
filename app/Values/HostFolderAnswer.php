<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\Payloads\HostFolderUseReplyPayload;
use App\Models\Hosts\HostInstruction;

/**
 * Where a host's account folder instruction stands: still waiting, done, or refused with the host's reason, and for a
 * folder use whether a container still binds the folder.
 */
final readonly class HostFolderAnswer
{
    public function __construct(public HostInstructionStatus $status, public string $reason, public bool $isBound) {}

    public static function of(HostInstruction $instruction): self
    {
        // Only a folder use answers whether the folder is bound; a made or removed folder answers that it is done.
        $isAnsweredFolderUse = $instruction->status === HostInstructionStatus::Done
            && $instruction->type === HostInstructionType::FolderUse;

        if ($isAnsweredFolderUse) {
            $reply = HostFolderUseReplyPayload::from($instruction->answer->facts ?? []);

            return new self($instruction->status, $reply->reason ?? '', $reply->isBound);
        }

        if ($instruction->status === HostInstructionStatus::Done) {
            return new self($instruction->status, '', false);
        }

        $reason = $instruction->answer->reason ?? $instruction->refusal->value ?? '';

        return new self($instruction->status, $reason, false);
    }

    public function isPending(): bool
    {
        return ! $this->isDone() && ! $this->isRefused();
    }

    public function isDone(): bool
    {
        return $this->status === HostInstructionStatus::Done;
    }

    public function isRefused(): bool
    {
        return $this->status === HostInstructionStatus::Refused;
    }
}
