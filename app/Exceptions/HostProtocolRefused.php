<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessType;
use RuntimeException;

/**
 * An instruction the journal will not make or take: its host was revoked, or its process no longer runs, takes no such
 * instruction or runs on another host.
 */
final class HostProtocolRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function revoked(string $hostId): self
    {
        return new self("Host {$hostId} is revoked and takes no instructions.");
    }

    /**
     * @param  list<string>  $fields
     */
    public static function containedPlanNamesHost(array $fields): self
    {
        $named = implode(', ', $fields);

        return new self("A contained plan names nothing of the host it runs on, but names {$named}.");
    }

    /**
     * @param  list<string>  $variables
     */
    public static function containedGrantPartial(array $variables): self
    {
        $missing = implode(', ', $variables);

        return new self("A contained plan carries its start grant whole, but misses {$missing}.");
    }

    public static function reportWithoutIdentity(string $processId): self
    {
        return new self("The host reported process {$processId} running without the identity it runs under.");
    }

    public static function reportWithoutEvidence(string $processId): self
    {
        return new self("The host reported process {$processId} ended without saying how.");
    }

    public static function notRunning(string $processId): self
    {
        return new self("Process {$processId} no longer runs.");
    }

    public static function unsuited(string $processId, HostInstructionType $instruction, HostProcessType $type): self
    {
        return new self("Process {$processId} is a {$type->value} process, which takes no {$instruction->value} instruction.");
    }

    public static function foreignProcess(string $hostId, string $processId): self
    {
        return new self("Process {$processId} does not run on host {$hostId}.");
    }

    public static function foreignInstruction(string $hostId, string $instructionId): self
    {
        return new self("Instruction {$instructionId} is not an instruction of host {$hostId}.");
    }

    public static function lacksCapability(string $hostId, HostInstructionType $instruction): self
    {
        return new self("Host {$hostId} does not carry out {$instruction->value} instructions; update the host.");
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
