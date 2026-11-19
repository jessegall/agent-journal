<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Points Laravel's event cache at a file of the test's choosing, or back to its default with null.
 */
trait SetsEventCachePath
{
    private function useEventCachePath(string|null $path): void
    {
        if ($path === null) {
            unset($_SERVER['APP_EVENTS_CACHE'], $_ENV['APP_EVENTS_CACHE']);
            putenv('APP_EVENTS_CACHE');

            return;
        }

        $_SERVER['APP_EVENTS_CACHE'] = $path;
        $_ENV['APP_EVENTS_CACHE'] = $path;
        putenv("APP_EVENTS_CACHE={$path}");
    }
}
