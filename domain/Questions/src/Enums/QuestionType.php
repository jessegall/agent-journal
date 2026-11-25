<?php

declare(strict_types=1);

namespace Domain\Questions\Enums;

/**
 * Whether a question takes any text as its answer or one of its options.
 */
enum QuestionType: string
{
    case Open = 'open';
    case Choice = 'choice';
}
