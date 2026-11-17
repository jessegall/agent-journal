<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Access\Models\User;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The signed-in user as every page may show them: their id (it keys what the browser keeps per user, such as message
 * drafts) and display name, never a credential.
 *
 * @method static static from(User $user)
 */
#[TypeScript]
final class ViewerData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {}

    public static function fromUser(User $user): self
    {
        return new self(id: (string) $user->id, name: $user->name);
    }
}
