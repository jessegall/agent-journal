<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

use App\Support\RecordIdentity;

/**
 * A record an agent can focus on, such as a task: the focus names it by its identity and knows nothing else of it.
 */
interface Focusable
{
    /**
     * The record the focus names.
     */
    public function focusIdentity(): RecordIdentity;

    /**
     * Refuses the focus when the record cannot be focused on now, such as a task that is not started.
     */
    public function assertFocusable(): void;
}
