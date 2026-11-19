<?php

declare(strict_types=1);

namespace App\Communication\States\Support;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\SubjectReference;

/**
 * The frame of answering one message, named by the exact claim the actor holds on it, so a replaced claim is another
 * frame.
 */
final class AnsweringMessageStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'communication.answering';

    public static function forClaim(string $claimAssignmentId): StateReference
    {
        return self::about(new SubjectReference($claimAssignmentId, 0));
    }
}
