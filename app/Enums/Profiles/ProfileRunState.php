<?php

declare(strict_types=1);

namespace App\Enums\Profiles;

/**
 * Where a profile script run stands: running its instructions, suspended on a step the host still owes, admitted to
 * the final checks, returned to the actor with what to do, or held for repair.
 */
enum ProfileRunState: string
{
    case Running = 'running';
    case Suspended = 'suspended';
    case FinalChecks = 'final_checks';
    case Returned = 'returned';
    case Held = 'held';

    /**
     * Whether the run still has instructions to go through.
     */
    public function isUnfinished(): bool
    {
        return $this === self::Running || $this === self::Suspended;
    }

    /**
     * @return list<self>
     */
    public static function unfinished(): array
    {
        return array_values(array_filter(self::cases(), fn (self $state) => $state->isUnfinished()));
    }
}
