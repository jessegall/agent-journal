<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Octane;

use App\Bus\RunningCommand;

/**
 * A class listener that records the running command it was built with, a service scoped to each request.
 */
final class ContainerRecordingListener
{
    public static RunningCommand|null $running = null;

    public function __construct(RunningCommand $running)
    {
        self::$running = $running;
    }

    public function handle(): void {}
}
