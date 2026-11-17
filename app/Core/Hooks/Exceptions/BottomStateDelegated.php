<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

/**
 * The bottom state delegated a hook; it carries the frames the walk visited, top first, for the error log.
 */
final class BottomStateDelegated extends LogicException
{
    /**
     * @param  list<string>  $visitedFrames
     */
    private function __construct(string $message, public readonly array $visitedFrames)
    {
        parent::__construct($message);
    }

    /**
     * @param  list<string>  $visitedFrames
     */
    public static function for(string $stateType, string $hookMethod, array $visitedFrames): self
    {
        return new self("The bottom state {$stateType} delegated {$hookMethod} after visiting ".implode(', ', $visitedFrames).'.', $visitedFrames);
    }
}
