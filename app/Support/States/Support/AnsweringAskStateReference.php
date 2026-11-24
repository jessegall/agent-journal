<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Models\Asks\AskHop;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The stack reference of answering one hop of an ask, held by the hop's holder until the ask closes or moves on.
 */
final class AnsweringAskStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'supervision.answering';

    public static function forHop(AskHop $hop): StateReference
    {
        return self::about(
            new SubjectReference($hop->id, $hop->version),
            ['askId' => $hop->ask_id, 'hopId' => $hop->id],
        );
    }
}
