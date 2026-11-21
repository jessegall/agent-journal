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
     * The area of the code it is in: the folder under app or domain.
     */
    public function area(): string
    {
        return explode('/', $this->path)[1] ?? $this->path;
    }

    public function line(): string
    {
        return "{$this->path}:{$this->line} {$this->key()} {$this->form}: {$this->evidence}";
    }
}
