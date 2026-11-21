<?php

declare(strict_types=1);

namespace App\Hooks\Lifecycle;

use Closure;
use Illuminate\Container\Attributes\Scoped;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The lifecycle origin in effect while the engine runs an answer's commands; there is none otherwise, so a command
 * dispatched directly, by a helper or by an application, has no origin to name.
 */
#[Scoped]
final class LifecycleOrigins
{
    /**
     * @var Option<LifecycleOrigin>
     */
    private Option $current;

    public function __construct()
    {
        $this->current = None::create();
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(LifecycleOrigin $origin, Closure $work): mixed
    {
        $before = $this->current;
        $this->current = Some::create($origin);

        try {
            return $work();
        } finally {
            $this->current = $before;
        }
    }

    /**
     * @return Option<LifecycleOrigin>
     */
    public function current(): Option
    {
        return $this->current;
    }
}
