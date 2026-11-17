<?php

declare(strict_types=1);

namespace App\Domain\Agents\Models;

use App\Domain\Links\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * An agent the journal launches, with the role its bottom state follows.
 *
 * @property int $id
 * @property string $name
 * @property string $role
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'role'])]
final class Agent extends Model
{
    use Linkable;
}
