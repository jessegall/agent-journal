<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Enums\Settings\ActionMethod;

/**
 * An action a page or section owns: a route Web registers under the owning domain's prefix and route name, run behind
 * its owner's visibility check.
 */
final readonly class ActionRoute
{
    /**
     * @param  class-string  $controller
     */
    private function __construct(
        public ActionMethod $method,
        public string $path,
        public string $controller,
        public string $name,
    ) {}

    /**
     * A read an action needs beside its page, such as what became of a request.
     *
     * @param  class-string  $controller
     */
    public static function get(string $path, string $controller, string $name): self
    {
        return new self(ActionMethod::Get, $path, $controller, $name);
    }

    /**
     * @param  class-string  $controller
     */
    public static function post(string $path, string $controller, string $name): self
    {
        return new self(ActionMethod::Post, $path, $controller, $name);
    }

    /**
     * @param  class-string  $controller
     */
    public static function patch(string $path, string $controller, string $name): self
    {
        return new self(ActionMethod::Patch, $path, $controller, $name);
    }

    /**
     * @param  class-string  $controller
     */
    public static function delete(string $path, string $controller, string $name): self
    {
        return new self(ActionMethod::Delete, $path, $controller, $name);
    }
}
