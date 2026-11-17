<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Decisions\Decision;

/**
 * What one walk ends with: the answering decision, the context every visited state added, and the steps taken, with the stack as the walk left it.
 */
final readonly class HookAnswer
{
    /**
     * @param  list<string>  $context
     * @param  list<WalkStep>  $steps
     */
    public function __construct(
        public Decision $decision,
        public array $context,
        public array $steps,
        public AgentStack $stack,
    ) {}
}
