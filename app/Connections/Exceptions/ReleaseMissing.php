<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A journal-runner release, or a file of one, that this journal does not publish.
 */
final class ReleaseMissing extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function noneCurrent(): self
    {
        return new self('This journal publishes no journal-runner release.');
    }

    public static function version(string $version): self
    {
        return new self("This journal publishes no journal-runner release {$version}.");
    }

    public static function artifact(string $version, string $target, string $name): self
    {
        return new self("Release {$version} has no file {$name} for {$target}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }

    protected function status(): int
    {
        return 404;
    }
}
