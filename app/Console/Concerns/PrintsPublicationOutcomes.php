<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Enums\PublicationState;
use Illuminate\Console\Command;

/**
 * Prints what the supervisor's publishing did, one line per publication, and names this console run as the worker.
 *
 * @mixin Command
 */
trait PrintsPublicationOutcomes
{
    /**
     * @param  array<string, PublicationState>  $outcomes  by publication id
     */
    private function printOutcomes(array $outcomes): int
    {
        if ($outcomes === []) {
            $this->line('No publication was waiting.');

            return self::SUCCESS;
        }

        foreach ($outcomes as $publicationId => $state) {
            $this->line("Publication {$publicationId}: {$state->value}.");
        }

        return in_array(PublicationState::Failed, $outcomes, true) ? self::FAILURE : self::SUCCESS;
    }

    /**
     * The lease holder this console run claims publications as.
     */
    private function holder(): string
    {
        return 'console:'.gethostname().':'.getmypid();
    }
}
