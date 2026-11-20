<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Links\Support\Linkable;
use App\Programs\Enums\HookProgram;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One native conversation of a program in one settings store, owned by the agent whose start first entered it and
 * bound to that start's context reference.
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
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * The conversation a session first enters, under the host settings it ran with.
     */
    public static function begin(
        AgentSession $session,
        string $settingsIdentity,
        string $nativeId,
        string|null $context,
    ): self {
        return self::query()->create([
            'program' => $session->program,
            'settings_identity' => $settingsIdentity,
            'native_id' => $nativeId,
            'agent_id' => $session->agent_id,
            'context_reference' => $context,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The native id of the agent's latest conversation under this context in this program, the one a resume
     * continues; none when it never had one there.
     */
    public static function lastUnder(string $agentId, string $contextReference, HookProgram $program): string|null
    {
        $conversation = self::query()
            ->where('agent_id', $agentId)
            ->where('context_reference', $contextReference)
            ->where('program', $program->value)
            ->latest()
            ->first();

        return $conversation?->native_id;
    }

    // ----------[ Answers ]----------

    /**
     * Whether a session of this agent, started for this context, may continue the conversation.
     */
    public function admits(string $agentId, string|null $contextReference): bool
    {
        return $this->agent_id === $agentId && $this->context_reference === $contextReference;
    }

    // ----------[ Scopes ]----------

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
        $query->where('program', $program)->where(
            'settings_identity',
            $settingsIdentity,
        )->where('native_id', $nativeId);
    }
}
