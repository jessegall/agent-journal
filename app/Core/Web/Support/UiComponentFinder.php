<?php

declare(strict_types=1);

namespace App\Core\Web\Support;

use App\Core\Ui\Support\UiDeclarations;
use Illuminate\View\FileViewFinder;
use InvalidArgumentException;

/**
 * Inertia's page check, answered from the same declarations the UI manifest is built from: a declared page's component
 * by its <domain>/<path> name, and today's pages under resources/js/pages through the usual finder until they move.
 */
final readonly class UiComponentFinder
{
    public function __construct(
        private UiDeclarations $declarations,
        private FileViewFinder $legacyPages,
    ) {}

    /**
     * @throws InvalidArgumentException
     */
    public function find(string $component): string
    {
        foreach ($this->declarations->pages() as $page) {
            if ($page->componentName() === $component) {
                return $page->componentFile;
            }
        }

        return $this->legacyPages->find($component);
    }
}
