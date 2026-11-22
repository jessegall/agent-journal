<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use Spatie\LaravelData\Data;

/**
 * A state that holds values of its own, such as a counter or a step, beside what its subject's rows say: its frame
 * saves them with the stack, and a restored frame hands them back, so a restart or a reload keeps them.
 */
interface OwnValuesState
{
    /**
     * The state's own values as they stand now, saved with its frame.
     */
    public function ownValues(): Data;

    /**
     * Takes back the values its frame saved, as the state's own Data reads them.
     *
     * @param  array<string, mixed>  $stored
     */
    public function restoreOwnValues(array $stored): void;
}
