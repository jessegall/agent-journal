<?php

declare(strict_types=1);

namespace App\Domain\Memory\Models;

use App\Domain\Hooks\Models\OwnedByOneAgent;
use App\Domain\Links\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Something an agent must still know after a compaction. Each compaction lowers its weight by one; at nought it is gone.
 * Only the agent that keeps it reads it.
 *
 * @property int $id
 * @property int $agent_id
 * @property string $text
 * @property int $weight
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text', 'weight'])]
final class Memory extends Model
{
    use Linkable;
    use OwnedByOneAgent;

    public function keepFor(int $agentId): void
    {
        $this->agent_id = $agentId;
        $this->save();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['agent_id' => 'integer', 'weight' => 'integer'];
    }
}
