<?php

declare(strict_types=1);

namespace App\Support\Gateways\Support;

use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Process\InvokedProcess;

/**
 * The gateway programs this supervisor run started, by the reference its endpoints carry; one started in another run
 * is never adopted, so closing it here does nothing.
 */
#[Singleton]
final class GatewayChildren
{
    private const int TERMINATE = 15;

    private const int KILL = 9;

    private const int GRACE_SECONDS = 10;

    private const int LOOK_MICROSECONDS = 100_000;

    /**
     * @var array<string, InvokedProcess>
     */
    private array $children = [];

    public function keep(string $reference, InvokedProcess $child): void
    {
        $this->children[$reference] = $child;
    }

    public function stop(string $reference): void
    {
        if (! array_key_exists($reference, $this->children)) {
            return;
        }

        $child = $this->children[$reference];
        unset($this->children[$reference]);
        $this->end($child);
    }

    /**
     * Asks the program to end, and ends it by force when it is still running ten seconds later; a program that
     * already exited is left alone, since an exited program cannot be signalled.
     */
    public function end(InvokedProcess $child): void
    {
        if (! $child->running()) {
            return;
        }

        $child->signal(self::TERMINATE);
        $deadline = microtime(true) + self::GRACE_SECONDS;

        while ($child->running() && microtime(true) < $deadline) {
            usleep(self::LOOK_MICROSECONDS);
        }

        if ($child->running()) {
            $child->signal(self::KILL);
        }
    }
}
