<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Models\MenuEntry;
use App\Agents\Values\MenuStep;

/**
 * A menu library entry as the host replays it, and nothing else of its owner's: the goal, the steps from the screen
 * the first one expects, what replaying it completes and the proof that ends it.
 */
final readonly class LibraryEntryAnswer
{
    /**
     * @param  list<MenuStep>  $steps
     */
    private function __construct(
        public string $id,
        public string $program,
        public EntryGoalAnswer $goal,
        public array $steps,
        public string $completes,
        public int|null $nextStep,
        public string $proof,
    ) {}

    public static function of(MenuEntry $entry): self
    {
        return new self(
            $entry->id,
            $entry->program,
            EntryGoalAnswer::of($entry->goal()),
            $entry->steps(),
            $entry->completes->value,
            $entry->next_step,
            $entry->proof,
        );
    }
}
