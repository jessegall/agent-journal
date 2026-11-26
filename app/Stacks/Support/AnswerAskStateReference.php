<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Models\Asks\AskHop;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;

/**
 * The stack reference of answering one hop of an ask, held by the hop's holder until the ask closes or moves on.
 */
final class AnswerAskStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.asks.answer';
    }

    public static function forHop(AskHop $hop): StateReference
    {
        return self::about(
            new SubjectReference($hop->id, $hop->version),
            ['askId' => $hop->ask_id, 'hopId' => $hop->id],
        );
    }
}
