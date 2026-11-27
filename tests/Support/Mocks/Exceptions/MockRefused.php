<?php

declare(strict_types=1);

namespace Tests\Support\Mocks\Exceptions;

use LogicException;

/**
 * A mock's script refused what the test asked of it before anything was written, naming what to give instead.
 */
final class MockRefused extends LogicException
{
    public static function noRecording(string $folder): self
    {
        return new self("No recording is kept at {$folder}: name a recording of the mock's build.");
    }

    public static function otherDriver(string $build, string $driver): self
    {
        return new self("The build {$build} is not one of {$driver}: name it as {$driver}/<version>.");
    }
}
