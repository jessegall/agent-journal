<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Support\RecordIdentity;
use App\Hooks\Models\Support\BelongsToOneAgent;
use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A note an agent writes while it works. Only the agent that wrote it reads it; a user reads every note.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $text
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text'])]
#[Table('module_notes')]
final class Note extends Model implements Assignable
{
    use BelongsToOneAgent, HasUlids;
    use Linkable;

    /**
     * The stable name links and assignments use for a note.
     */
    public const string LINK_TYPE = 'notes.note';

    public function saveFor(string $agentId): void
    {
        $this->agent_id = $agentId;
        $this->save();
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }
}
