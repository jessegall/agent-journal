<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Inputs\HookInput;
use LogicException;

/**
 * The bottom state delegated a hook; it carries the steps the walk took, for the error log.
 */
final class BottomStateDelegated extends LogicException
{
    /**
     * @param  list<WalkStep>  $steps
     */
    private function __construct(string $message, public readonly array $steps)
    {
        parent::__construct($message);
    }

    /**
     * @param  list<WalkStep>  $steps
     */
    public static function for(Frame $frame, HookInput $input, array $steps): self
    {
        return new self("The bottom state {$frame->typeKey()} delegated {$input->methodName()}.", $steps);
    }
}
