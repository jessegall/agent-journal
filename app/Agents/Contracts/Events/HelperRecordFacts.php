<?php

declare(strict_types=1);

namespace App\Agents\Contracts\Events;

use App\Support\RecordIdentity;

/**
 * Tells a parent's states about the helpers it sent to work on a record, such as a plan to review: when one is sent,
 * and when one reports back.
 */
interface HelperRecordFacts
{
    /**
     * The calling agent assigned the helper a job about the record; its own states hear it once the call commits.
     */
    public function assigned(RecordIdentity $subject, string $agentId): void;

    /**
     * The helper sent on the record finished its job; every running stack with a state listening for it hears it.
     */
    public function finished(RecordIdentity $subject, string $agentId): void;
}
