<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

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
}
