<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * A command that declares Authorize names what it acts on: its model, locked; an aggregate of every record it changes,
 * locked in a stable order, which the policy authorizes as a whole; or a model class for a class-level ability such
 * as Create. It may look up and lock, never change anything or raise an event.
 */
interface RecordCommand
{
    /**
     * @return object|class-string
     */
    public function subject(): object|string;
}
