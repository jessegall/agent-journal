<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

/**
 * A test listener that counts the events it received.
 */
final class CountingListener
{
    public static int $received = 0;

    public function handle(object $event): void
    {
        self::$received++;
    }
}
