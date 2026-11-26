<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Data\HostFrameData;
use App\Terminals\Screens\Enums\ScreenType;

/**
 * Reads a driver's frame as a ready prompt, a known menu or an unknown screen. A region is still when each of its
 * rows has gone unchanged, by the host's own clock, for at least its interval, so a frame that arrives late never
 * makes a redrawing screen look still.
 */
final readonly class ScreenClassifier
{
    public function readingOf(ScreenLayout $layout, HostFrameData $frame): ScreenReading
    {
        $hasOptions = $layout->optionsOf($frame) !== null && $layout->composer->rowsOf($frame) === null;

        foreach ($layout->menus as $family) {
            if ($family->isShownOn($frame)) {
                $isStill = self::isStill($frame, $family->options->rowsOf($frame), $family->stillMs);

                return new ScreenReading(ScreenType::Menu, $family, $isStill, $hasOptions);
            }
        }

        $composer = $layout->composer->rowsOf($frame);

        if ($composer !== null && self::holdsEmptyComposer($layout, $frame, $composer)) {
            $isStill = self::isStill($frame, $composer, $layout->composerStillMs);

            return new ScreenReading(ScreenType::PromptReady, null, $isStill, $hasOptions);
        }

        $isStill = self::isStill($frame, new RowRange(0, count($frame->rows)), $layout->unknownStillMs);

        return new ScreenReading(ScreenType::Unknown, null, $isStill, $hasOptions);
    }

    /**
     * Whether the composer is on the layout's buffer with the cursor in it at the column of an empty composer:
     * nothing anybody typed is there.
     */
    private static function holdsEmptyComposer(ScreenLayout $layout, HostFrameData $frame, RowRange $composer): bool
    {
        return $frame->buffer === $layout->buffer
            && $composer->holds($frame->cursorRow)
            && $frame->cursorColumn === $layout->emptyCursorColumn;
    }

    /**
     * Whether each row of the range has gone unchanged for at least the milliseconds; a range the frame does not
     * draw is never still.
     */
    private static function isStill(HostFrameData $frame, RowRange|null $rows, int $milliseconds): bool
    {
        if ($rows === null) {
            return false;
        }

        return array_all($rows->rows(), fn (int $row) => ($frame->unchangedMs[$row] ?? 0) >= $milliseconds);
    }
}
