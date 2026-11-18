<?php

declare(strict_types=1);

namespace App\Core\Bus\Support;

use App\Core\Bus\Enums\MiddlewareStage;

/**
 * A middleware a module adds to the bus: its class, the commands it acts on and the stage it runs in.
 */
final readonly class MiddlewareDeclaration
{
    /**
     * @param  class-string  $middleware
     */
    private function __construct(
        public string $middleware,
        public CommandScope $scope,
        public MiddlewareStage $stage,
    ) {}

    /**
     * Runs before the command's transaction opens.
     *
     * @param  class-string  $middleware
     */
    public static function around(string $middleware, CommandScope $scope): self
    {
        return new self($middleware, $scope, MiddlewareStage::BeforeTransaction);
    }

    /**
     * Runs inside the command's transaction.
     *
     * @param  class-string  $middleware
     */
    public static function inside(string $middleware, CommandScope $scope): self
    {
        return new self($middleware, $scope, MiddlewareStage::InsideTransaction);
    }
}
