<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Hosts\EnrolledHost;
use App\Models\Hosts\HostInstruction;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A host the test enrolled: its id and the instructions the journal made for the host itself, for no process of it.
 */
final readonly class HostFacts implements Facts
{
    public function __construct(private EnrolledHost $host) {}

    public function facts(): array
    {
        return [
            'id' => $this->host->hostId,
            'instructions' => fn () => array_map(
                fn (HostInstruction $instruction) => new HostInstructionFacts($instruction),
                HostInstruction::findForHostItself($this->host->hostId),
            ),
        ];
    }
}
