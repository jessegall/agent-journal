<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockableWindow;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a declared page's reader answers: one checked tree of catalogue parts under a stable root. It is only made
 * through of(), which refuses a tree that breaks the catalogue, so a partly valid layout is never sent. A layout that
 * can be docked keeps the source it docks in a private field, which never reaches the browser.
 */
#[TypeScript]
final class DeclaredLayoutData extends Data implements DockableWindow
{
    /**
     * @param  Option<DockIdentity>  $dock
     */
    private function __construct(public readonly LayoutPartData $root, private readonly Option $dock) {}

    /**
     * @throws LayoutRefused
     */
    public static function of(LayoutPartData $root): self
    {
        if ($root->assertWithinCatalogue() > LayoutLimits::PART_LIMIT) {
            throw LayoutRefused::tooManyParts();
        }

        return new self($root, None::create());
    }

    /**
     * The same layout, docked as the given source when the user docks its window.
     */
    public function docking(DockIdentity $source): self
    {
        return new self($this->root, new Some($source));
    }

    /**
     * The source this layout docks as, or none for a layout that cannot be docked.
     *
     * @return Option<DockIdentity>
     */
    public function dockSource(): Option
    {
        return $this->dock;
    }
}
