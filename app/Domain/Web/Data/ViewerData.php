<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Access\Api\Viewer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The signed-in user as every page may show them: their id (it keys what the browser keeps per user, such as message
 * drafts) and display name, never a credential.
 *
 * @method static static from(Viewer $viewer)
 */
#[TypeScript]
final class ViewerData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {}

    public static function fromViewer(Viewer $viewer): self
    {
        return new self(id: (string) $viewer->id, name: $viewer->name);
    }
}
