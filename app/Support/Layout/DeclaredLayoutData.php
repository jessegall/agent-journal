<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Exceptions\LayoutRefused;
use App\Navigation\Contracts\PresentsLayout;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a declared page's reader answers: one checked tree of catalogue parts under a stable root. It is only made
 * through typed fields, which refuse a tree that breaks the catalogue, so a partly valid layout is never sent.
 */
#[TypeScript]
final class DeclaredLayoutData extends Data implements PresentsLayout
{
    /** @use \App\Web\Creation\Buildable<DeclaredLayoutDataFields> */
    use \App\Web\Creation\Buildable;

    /**
     * The most parts one layout holds, its root among them.
     */
    public const int PART_LIMIT = 500;

    protected const string FIELDS = DeclaredLayoutDataFields::class;

    public function __construct(public readonly LayoutPartData $root)
    {
        if ($root->assertWithinCatalogue() > self::PART_LIMIT) {
            throw LayoutRefused::tooManyParts(self::PART_LIMIT);
        }
    }

    public function layout(): self
    {
        return $this;
    }
}
