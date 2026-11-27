<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\Payloads\HostContainerNamesPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunResultPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunResultsPayload;
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
        if ($instruction->status === HostInstructionStatus::Done && $instruction->type === HostInstructionType::ListContainers) {
            $listed = HostContainerNamesPayload::from($instruction->answer->facts ?? []);

            return new self($instruction->status, '', $listed->names !== []);
        }

        // A made or removed folder is done once its run ended well; a run that failed answers why, as a refusal.
        if ($instruction->status === HostInstructionStatus::Done) {
            $results = HostContainerRunResultsPayload::from($instruction->answer->facts ?? []);
            $failed = array_filter($results->results, fn (HostContainerRunResultPayload $result) => $result->exitCode !== 0);

            return $failed === []
                ? new self($instruction->status, '', false)
                : new self(HostInstructionStatus::Refused, array_values($failed)[0]->output, false);
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
