<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Access\Models\User;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The signed-in person as every page may show them: a display name, never a credential.
 *
 * @method static static from(User $person)
 */
#[TypeScript]
final class ViewerData extends Data
{
    public function __construct(public readonly string $name) {}

    public static function fromUser(User $person): self
    {
        return new self(name: $person->name);
    }
}
