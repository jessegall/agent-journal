<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Hosts\HostInstruction;

/**
 * Every instruction the journal made for a process or for a host itself, answered or not, as a test reads them back.
 */
final class MadeHostInstructions
{
    /**
     * The instructions made for the process, by their number.
     *
     * @return list<HostInstruction>
     */
    public static function forProcess(string $processId): array
    {
        return array_values(HostInstruction::query()->ofProcess($processId)->bySequence()->get()->all());
    }

    /**
     * The instructions made for the host itself, for no process of it, oldest first.
     *
     * @return list<HostInstruction>
     */
    public static function forHostItself(string $hostId): array
    {
        return array_values(HostInstruction::query()->where('host_id', $hostId)->whereNull('host_process_id')
            ->bySequence()->get()->all());
    }
}
