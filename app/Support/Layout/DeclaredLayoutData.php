<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Exceptions\LayoutRefused;
use App\Navigation\Contracts\PresentsLayout;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a declared page's reader answers: one checked tree of catalogue parts under a stable root. It is only made
 * through of(), which refuses a tree that breaks the catalogue, so a partly valid layout is never sent.
 */
#[TypeScript]
final class DeclaredLayoutData extends Data implements PresentsLayout
{
    /**
     * The most parts one layout holds, its root among them.
     */
    public const int PART_LIMIT = 500;

    private function __construct(public readonly LayoutPartData $root) {}

    /**
     * @throws LayoutRefused
     */
    public static function of(LayoutPartData $root): self
    {
        if ($root->assertWithinCatalogue() > self::PART_LIMIT) {
            throw LayoutRefused::tooManyParts(self::PART_LIMIT);
        }

        return new self($root);
    }

    public function layout(): self
    {
        return $this;
    }
}
