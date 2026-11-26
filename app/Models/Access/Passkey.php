<?php

declare(strict_types=1);

namespace App\Models\Access;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\HasUlidKey;
use Carbon\CarbonImmutable;
use Laravel\Passkeys\Passkey as PackagePasskey;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $credential_id
 * @property array<array-key, mixed> $credential
 * @property CarbonImmutable|null $last_used_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read string|null $authenticator
 * @property-read User $user
 *
 * @mixin \Eloquent
 */
final class Passkey extends PackagePasskey implements ReadableModel
{
    use BoundedReads;
    use HasUlidKey;
    use Linkable;
}
