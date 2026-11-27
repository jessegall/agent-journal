<?php

declare(strict_types=1);

namespace App\Declarations;

/**
 * The actions a page declares, added in its scope one route after another, in the order the page offers them.
 */
final class PageActions
{
    /**
     * @var list<ActionRoute>
     */
    private array $routes = [];

    public function get(string $path, string $controller, string $name): self
    {
        $this->routes[] = ActionRoute::get($path, $controller, $name);

        return $this;
    }

    public function post(string $path, string $controller, string $name): self
    {
        $this->routes[] = ActionRoute::post($path, $controller, $name);

        return $this;
    }

    public function patch(string $path, string $controller, string $name): self
    {
        $this->routes[] = ActionRoute::patch($path, $controller, $name);

        return $this;
    }

    public function delete(string $path, string $controller, string $name): self
    {
        $this->routes[] = ActionRoute::delete($path, $controller, $name);

        return $this;
    }

    /**
     * @return list<ActionRoute>
     */
    public function routes(): array
    {
        return $this->routes;
    }
}
