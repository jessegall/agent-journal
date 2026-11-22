<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\CurrentUser;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The signed-in user as every page may show them: their id (it keys what the browser keeps per user, such as message
 * drafts) and display name, never a credential.
 *
 * @method static static from(CurrentUser $user)
 */
#[TypeScript]
final class CurrentUserData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {}

    public static function fromCurrentUser(CurrentUser $user): self
    {
        return new self(id: (string) $user->id, name: $user->name);
    }
}
