<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Agents\Drivers\Enums\HoldReason;
use App\Terminals\Screens\Enums\ScreenType;

/**
 * Turns a still reading of a driver's screen into the hold it raises. It answers no menu, except a family whose
 * harmless entry is accepted with its recorded keys; an unrecognised screen holds as unknown, and nothing is guessed.
 */
final readonly class ScreenHolds
{
    public function holdOf(ScreenReading $reading): ScreenHold
    {
        $family = $reading->menu;

        if ($family === null) {
            $isReady = $reading->type === ScreenType::PromptReady;

            return new ScreenHold($isReady ? HoldReason::None : HoldReason::UnknownScreen);
        }

        if ($family->answer !== null) {
            return new ScreenHold(HoldReason::None, $family->name, $family->answer);
        }

        return new ScreenHold($family->hold, $family->name);
    }
}
