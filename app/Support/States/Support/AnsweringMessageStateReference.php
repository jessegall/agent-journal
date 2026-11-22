<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The frame of answering one message, named by the exact claim the actor holds on it, so a replaced claim is another
 * frame.
 */
final class AnsweringMessageStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'communication.answering';

    public static function forClaim(string $assignmentId): StateReference
    {
        return self::about(new SubjectReference($assignmentId, 0));
    }
}
