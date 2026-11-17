<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

/**
 * An answer that refuses with a reason the agent reads: a denial or a held stop.
 */
interface Refusal extends Answer
{
    public function reason(): Reason;
}
