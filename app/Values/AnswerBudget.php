<?php

declare(strict_types=1);

namespace App\Values;

/**
 * How many tool uses an agent may make after it was shown a chat message before it must answer in the chat.
 */
final readonly class AnswerBudget
{
    public function __construct(public int $toolUses = 5) {}

    /**
     * How many of the budget's tool uses are left after the ones made, never below none.
     */
    public function leftAfter(int $toolUses): int
    {
        return max(0, $this->toolUses - $toolUses);
    }
}
