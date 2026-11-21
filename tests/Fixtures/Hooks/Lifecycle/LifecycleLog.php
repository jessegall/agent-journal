<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Hooks\Values\LifecycleCommands;

/**
 * The lifecycle calls fixture states received, in order, as "enter:42" and the like.
 */
final class LifecycleLog
{
    /**
     * @var list<string>
     */
    public array $calls = [];

    /**
     * @var list<string> subjects whose enter throws
     */
    public array $failingEnters = [];

    /**
     * @var array<string, LifecycleCommands> what a call such as "enter:42" answers; any other call answers none
     */
    public array $answers = [];

    public function answerOf(string $call): LifecycleCommands
    {
        return $this->answers[$call] ?? LifecycleCommands::none();
    }
}
