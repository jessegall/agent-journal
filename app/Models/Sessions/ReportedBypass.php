<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;

/**
 * @property string $id
 * @property string $agent_session_id
 * @property string $native_event
 * @property string $failure
 * @property CarbonImmutable $occurred_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class ReportedBypass extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['occurred_at' => 'immutable_datetime'];
    }
}
