<?php

declare(strict_types=1);

namespace App\Models\Access;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Support\Carbon;
use Laravel\Passkeys\Passkey as PackagePasskey;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $credential_id
 * @property array $credential
 * @property ?Carbon $last_used_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property-read null|string $authenticator attribute
 */
final class Passkey extends PackagePasskey implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
}
