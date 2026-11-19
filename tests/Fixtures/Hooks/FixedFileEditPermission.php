<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\FileEditPermission;
use App\Hooks\States\Support\ReadyStateLoader;
use Illuminate\Container\Container;

/**
 * A file edit permission fixed for a test: the acting agent's profile either lets it change files or does not.
 */
final readonly class FixedFileEditPermission implements FileEditPermission
{
    public function __construct(private bool $mayEditFiles = true) {}

    /**
     * A ready state loader whose container gives this permission to every ready state it builds.
     */
    public static function loader(bool $mayEditFiles = true): ReadyStateLoader
    {
        $container = new Container();
        $container->instance(FileEditPermission::class, new self($mayEditFiles));

        return new ReadyStateLoader($container);
    }

    public function mayEditFiles(): bool
    {
        return $this->mayEditFiles;
    }
}
