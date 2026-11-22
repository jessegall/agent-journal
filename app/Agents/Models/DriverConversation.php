<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\ResumeRefusal;
use App\Agents\Exceptions\ResumeRefused;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One native conversation of a driver in one settings store, owned by the agent whose start first entered it and
 * bound to that start's context reference.
 *
 * @property string $id
 * @property string $resume_protocol
 * @property string $settings_identity
 * @property string $native_id
 * @property string $agent_id
 * @property string|null $context_reference
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['resume_protocol', 'settings_identity', 'native_id', 'agent_id', 'context_reference'])]
final class DriverConversation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * The conversation a session first enters, under the host settings it ran with.
     */
    public static function create(
        AgentSession $session,
        string $settingsIdentity,
        string $nativeId,
        string|null $context,
    ): self {
        return self::query()->create([
            'resume_protocol' => $session->driver_key,
            'settings_identity' => $settingsIdentity,
            'native_id' => $nativeId,
            'agent_id' => $session->agent_id,
            'context_reference' => $context,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The native id of the agent's latest conversation under this context in this driver, the one a resume
     * continues; none when it never had one there.
     */
    public static function lastUnder(string $agentId, string $contextReference, string $driver): string|null
    {
        $conversation = self::query()
            ->where('agent_id', $agentId)
            ->where('context_reference', $contextReference)
            ->where('resume_protocol', $driver)
            ->latest()
            ->first();

        return $conversation?->native_id;
    }

    /**
     * The native id of the conversation the owner chose, once it is checked to be this agent's, on this driver and
     * for this context; a newer conversation never takes its place.
     *
     * @throws ResumeRefused
     */
    public static function chosenFor(
        string $conversationId,
        string $agentId,
        string $driver,
        string|null $contextReference,
    ): string {
        $conversation = self::query()->whereKey($conversationId)->firstOr(
            fn () => throw ResumeRefused::because(ResumeRefusal::ConversationMissing),
        );

        $conversation->assertContinuableBy($agentId, $driver, $contextReference);

        return $conversation->native_id;
    }

    // ----------[ Answers ]----------

    /**
     * @throws ResumeRefused
     */
    public function assertContinuableBy(string $agentId, string $driver, string|null $contextReference): void
    {
        $refusal = match (true) {
            $this->agent_id !== $agentId => ResumeRefusal::OtherAgent,
            $this->resume_protocol !== $driver => ResumeRefusal::OtherDriver,
            $this->context_reference !== $contextReference => ResumeRefusal::OtherContext,
            default => null,
        };

        if ($refusal !== null) {
            throw ResumeRefused::because($refusal);
        }
    }

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
    protected function native(Builder $query, string $driver, string $settingsIdentity, string $nativeId): void
    {
        $query->where('resume_protocol', $driver)->where(
            'settings_identity',
            $settingsIdentity,
        )->where('native_id', $nativeId);
    }
}
