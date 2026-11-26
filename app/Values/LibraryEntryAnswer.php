<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Values\EntryGoalAnswer;
use App\Agents\Drivers\Values\MenuStep;

/**
 * A menu library entry as the host replays it, and nothing else of its owner's: the goal, the steps from the screen
 * the first one expects, what replaying it completes and the proof that ends it.
 */
final readonly class LibraryEntryAnswer
{
    /**
     * @param  list<MenuStep>  $steps
     */
    public function __construct(
        public string $id,
        public string $driver,
        public EntryGoalAnswer $goal,
        public array $steps,
        public string $completes,
        public int|null $nextStep,
        public string $proof,
    ) {}
}
