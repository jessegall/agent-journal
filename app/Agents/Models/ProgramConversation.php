<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One native conversation of a program in one settings store, owned by the agent whose launch first entered it and
 * bound to that launch's context reference.
 *
 * @property string $id
 * @property string $program
 * @property string $settings_identity
 * @property string $native_id
 * @property string $agent_id
 * @property string|null $context_reference
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['program', 'settings_identity', 'native_id', 'agent_id', 'context_reference'])]
final class ProgramConversation extends Model implements ReadableModel
{
    use Linkable;

    use BoundedReads;
    use HasUlids;

    /**
     * Whether a session of this agent, launched for this context, may continue the conversation.
     */
    public function admits(string $agentId, string|null $contextReference): bool
    {
        return $this->agent_id === $agentId && $this->context_reference === $contextReference;
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function native(Builder $query, string $program, string $settingsIdentity, string $nativeId): void
    {
        $query->where('program', $program)->where('settings_identity', $settingsIdentity)->where('native_id', $nativeId);
    }
}
