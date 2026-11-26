<?php

declare(strict_types=1);

namespace App\Reflection;

use App\Reflection\Exceptions\AttributeBuiltRecursively;
use Closure;

/**
 * One attribute as written on a declaration, at its own position: its arguments and its instance, each read once.
 */
final class AttributeOccurrence
{
    /**
     * @var array<int|string, mixed>
     */
    private array $arguments;

    private object $instance;

    private bool $isBuilding = false;

    /**
     * @param  string  $name  the attribute's class name as the declaration wrote it
     * @param  Closure(): array<int|string, mixed>  $readArguments
     * @param  Closure(): object  $build
     */
    public function __construct(
        private readonly string $name,
        private readonly Closure $readArguments,
        private readonly Closure $build,
        private readonly string $declaration,
    ) {}

    public function name(): string
    {
        return $this->name;
    }

    /**
     * The arguments as written, without building the attribute.
     *
     * @return array<int|string, mixed>
     */
    public function arguments(): array
    {
        return $this->arguments ??= ($this->readArguments)();
    }

    /**
     * The built attribute. A constructor that throws leaves it unbuilt, so the next read throws again.
     *
     * @throws AttributeBuiltRecursively
     */
    public function instance(): object
    {
        if (isset($this->instance)) {
            return $this->instance;
        }

        if ($this->isBuilding) {
            throw AttributeBuiltRecursively::on($this->declaration, $this->name());
        }

        $this->isBuilding = true;

        try {
            return $this->instance = ($this->build)();
        } finally {
            $this->isBuilding = false;
        }
    }

    /**
     * A new build of the attribute, never kept, for a reader whose use changes the object it is given.
     */
    public function freshInstance(): object
    {
        return ($this->build)();
    }
}
