<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Contracts\Records\ReadableModel;
use App\Enums\Sessions\ResumeRefusal;
use App\Exceptions\ResumeRefused;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $resume_protocol
 * @property string|null $originating_driver_key
 * @property int|null $account_generation
 * @property string|null $workspace_identity
 * @property string $settings_identity
 * @property string $native_id
 * @property string $agent_id
 * @property string|null $context_reference
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class DriverConversation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;

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
        $driverConversation = new self();
        $driverConversation->resume_protocol = $session->driver_key;
        $driverConversation->settings_identity = $settingsIdentity;
        $driverConversation->native_id = $nativeId;
        $driverConversation->agent_id = $session->agent_id;
        $driverConversation->context_reference = $context;
        $driverConversation->save();

        return $driverConversation;
    }

    // ----------[ Predicates ]----------

    /**
     * Whether a session of this agent, started for this context, may continue the conversation.
     */
    public function admits(string $agentId, string|null $contextReference): bool
    {
        return $this->agent_id === $agentId && $this->context_reference === $contextReference;
    }

    // ----------[ Asserts ]----------

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

    // ----------[ Queries ]----------

    /**
     * The native id of the agent's latest conversation under this context in this driver, the one a resume
     * continues; none when it never had one there.
     */
    public static function lastUnder(string $agentId, string $contextReference, string $driver): string|null
    {
        $conversation = self::query()
            ->heldUnder($agentId, $contextReference, $driver)
            ->newestFirst()
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
        $conversation = self::query()
            ->whereKey($conversationId)
            ->firstOr(ResumeRefused::throwing()->because(ResumeRefusal::ConversationMissing));
        $conversation->assertContinuableBy($agentId, $driver, $contextReference);

        return $conversation->native_id;
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

    /**
     * The agent's conversations under the context, resumed by the driver.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldUnder(Builder $query, string $agentId, string $contextReference, string $driver): void
    {
        $query->where('agent_id', $agentId)
            ->where('context_reference', $contextReference)
            ->where('resume_protocol', $driver);
    }

    /**
     * The rows of any of the given agents.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofAgents(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('agent_id', $ids);
    }

    /**
     * The rows of the given context reference.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withContextReference(Builder $query, string $reference): void
    {
        $query->where('context_reference', $reference);
    }

    /**
     * The rows of the given resume protocol.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withResumeProtocol(Builder $query, string $protocol): void
    {
        $query->where('resume_protocol', $protocol);
    }

    /**
     * The rows by created at descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestCreatedFirst(Builder $query): void
    {
        $query->orderByDesc('created_at');
    }
}
