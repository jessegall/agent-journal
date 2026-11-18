<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

/**
 * The published version of each binder page, 1 until a test publishes another.
 */
final class BinderPublications
{
    /**
     * @var array<string, string>
     */
    private array $versionOfId = [];

    public function publish(string $id, string $version): void
    {
        $this->versionOfId[$id] = $version;
    }

    public function versionOf(string $id): string
    {
        return $this->versionOfId[$id] ?? '1';
    }
}
