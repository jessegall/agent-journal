<?php

declare(strict_types=1);

namespace Domain\Memory\Models;

use App\Hooks\Models\Support\BelongsToOneAgent;
use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Something an agent must still know after a compaction. Each compaction lowers its weight by one; at nought it is gone.
 * Only the agent that keeps it reads it.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $text
 * @property int $weight
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text', 'weight'])]
final class Memory extends Model
{
    use BelongsToOneAgent, HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['weight' => 'integer'];
    }

    public function saveFor(string $agentId): void
    {
        $this->agent_id = $agentId;
        $this->save();
    }
}
