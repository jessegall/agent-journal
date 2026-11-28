<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\Screens\Enums\ScreenType;

/**
 * Reads a driver's frame as a ready prompt, a known menu or an unknown screen. A region is still when each of its
 * rows has gone unchanged, by the host's own clock, for at least its interval, so a frame that arrives late never
 * makes a redrawing screen look still.
 */
final readonly class ScreenClassifier
{
    public function readingOf(ScreenLayout $layout, HostFramePayload $frame): ScreenReading
    {
        $composer = $layout->composer->rowsOf($frame);
        $hasOptions = $layout->optionsOf($frame) !== null && $composer === null;

        foreach ($layout->menus as $family) {
            if ($family->isShownOn($frame) && ! self::isScrolledPast($family->options->rowsOf($frame), $composer)) {
                $isStill = self::isStill($frame, $family->options->rowsOf($frame), $family->stillMs);

                return new ScreenReading(ScreenType::Menu, $family, $isStill, $hasOptions);
            }
        }

        $isReady = $composer !== null
            && self::holdsEmptyComposer($layout, $frame, $composer)
            && ! $layout->isWorkingOn($frame);

        if ($isReady) {
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
    private static function holdsEmptyComposer(ScreenLayout $layout, HostFramePayload $frame, RowRange $composer): bool
    {
        return $frame->buffer === $layout->buffer
            && $composer->first === $frame->cursorRow
            && $composer->last === $composer->first + 1
            && $frame->cursorColumn === $layout->emptyCursorColumn;
    }

    /**
     * Whether the options sit above a drawn composer: lines of the conversation that read like a menu, such as an
     * echoed command and its answer, never an open menu, which takes the composer's place or sits below it.
     */
    private static function isScrolledPast(RowRange|null $options, RowRange|null $composer): bool
    {
        return $options !== null && $composer !== null && $options->last <= $composer->first;
    }

    /**
     * Whether each row of the range has gone unchanged for at least the milliseconds; a range the frame does not
     * draw is never still.
     */
    private static function isStill(HostFramePayload $frame, RowRange|null $rows, int $milliseconds): bool
    {
        if ($rows === null) {
            return false;
        }

        return array_all($rows->rows(), fn (int $row) => ($frame->unchangedMs[$row] ?? 0) >= $milliseconds);
    }
}
