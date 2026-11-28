<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Str;
use Illuminate\View\FileViewFinder;
use InvalidArgumentException;

/**
 * Inertia's page check, answered from the same declarations the client manifest is built from: a declared page's component
 * by its <domain>/<path> name, and the sign-in page under resources/js/pages/login through Laravel's view finder.
 */
final readonly class PageComponents
{
    public function __construct(
        private ClientDeclarations $declarations,
        private FileViewFinder $shellPages,
        private string $root,
    ) {}

    /**
     * The component's file as the Vite entry the page loads, a path from the project root.
     *
     * @throws InvalidArgumentException
     */
    public function entry(string $component): string
    {
        return Str::after($this->find($component), "{$this->root}/");
    }

    /**
     * @throws InvalidArgumentException
     */
    public function find(string $component): string
    {
        foreach ($this->declarations->pages() as $page) {
            if ($page->componentName() === $component) {
                return $page->componentFile;
            }

            if ($page->windowFile !== null && $page->windowComponentName() === $component) {
                return $page->windowFile;
            }
        }

        return $this->shellPages->find($component);
    }
}
