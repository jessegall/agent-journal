<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

/**
 * A test listener that counts the events it heard.
 */
final class CountingListener
{
    public static int $heard = 0;

    public function handle(object $event): void
    {
        self::$heard++;
    }
}
