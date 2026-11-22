<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One write of a model method outside its own row: where it is, what it does and the call that does it.
 */
final readonly class ModelWrite
{
    public function __construct(
        public string $path,
        public int $line,
        public string $type,
        public string $method,
        public string $form,
        public string $evidence,
    ) {}

    /**
     * The frozen lists' name for its method, Class::method.
     */
    public function key(): string
    {
        return "{$this->type}::{$this->method}";
    }

    /**
     * The owner of the code it is in: Core for app, or the package's folder under domain.
     */
    public function area(): string
    {
        $parts = explode('/', $this->path);

        return $parts[0] === 'app' ? 'Core' : ($parts[1] ?? $this->path);
    }

    /**
     * Its file and line, for sorting.
     *
     * @return array{string, int}
     */
    public function place(): array
    {
        return [$this->path, $this->line];
    }

    public function line(): string
    {
        return "{$this->path}:{$this->line} {$this->key()} {$this->form}: {$this->evidence}";
    }
}
