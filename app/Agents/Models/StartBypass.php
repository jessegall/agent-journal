<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One hook call the host answered on its own while the journal was unreachable, reported after recovery.
 *
 * @property string $id
 * @property string $agent_session_id
 * @property string $native_event
 * @property string $failure
 * @property CarbonImmutable $occurred_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['native_event', 'failure', 'occurred_at'])]
final class StartBypass extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['occurred_at' => 'immutable_datetime'];
    }
}
