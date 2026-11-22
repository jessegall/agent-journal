<?php

declare(strict_types=1);

namespace App\Contracts\Events;

use App\Support\ActorIdentity;
use App\Support\RecordIdentity;

/**
 * Tells a parent's states about the helpers it sent to work on a record, such as a plan to review: when one is sent,
 * and when one reports back.
 */
interface HelperRecordFacts
{
    /**
     * The calling agent sent the helper on the record; its own states hear it once the call commits.
     */
    public function sent(RecordIdentity $subject, string $agentId): void;

    /**
     * The helper the parent sent on the record reported back; the parent's running stack hears it, and a parent with
     * no running session hears nothing.
     */
    public function reported(ActorIdentity $parent, RecordIdentity $subject, string $agentId): void;
}
