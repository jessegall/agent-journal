<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\ClosingWordsDelivered;
use App\Events\Sessions\ClosingWordsKeptPrivate;
use App\Events\Sessions\ClosingWordsOffered;
use App\Events\Sessions\DriverTurnFinished;
use App\Models\Agents\AgentRuntime;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $process_generation
 * @property string $native_prompt_id
 * @property ?string $observed_model
 * @property ?string $observed_effort
 * @property ?string $outcome
 * @property CarbonImmutable $started_at
 * @property ?CarbonImmutable $finished_at
 * @property ?string $closing_words
 * @property ?string $closing_words_digest
 * @property ?string $delivered_message_id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property AgentRuntime $runtime
 */
final class DriverTurn extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'immutable_datetime',
            'finished_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The turn of this native prompt in this process generation, recorded the first time it is seen; a repeated
     * report finds the same turn. The caller's transaction holds the runtime's lock, so two reports never race.
     */
    public static function create(
        string $runtimeId,
        int $processGeneration,
        string $nativePromptId,
        CarbonImmutable $startedAt,
    ): self {
        $existing = self::query()->ofPrompt($runtimeId, $processGeneration, $nativePromptId)->first();

        if ($existing !== null) {
            return $existing;
        }

        $driverTurn = new self();
        $driverTurn->agent_runtime_id = $runtimeId;
        $driverTurn->process_generation = $processGeneration;
        $driverTurn->native_prompt_id = $nativePromptId;
        $driverTurn->started_at = $startedAt;
        $driverTurn->assertSaved($driverTurn->save());

        return $driverTurn;
    }

    /**
     * Whether these exact words were already offered on this turn.
     */
    public function hasOffered(string $words): bool
    {
        return $this->closing_words_digest === self::digestOf($words);
    }

    public function isOfferPending(): bool
    {
        return $this->closing_words !== null;
    }

    // ----------[ Mutations ]----------

    /**
     * Keeps the agent's closing words privately on this turn while it is asked whether the user should see them.
     */
    public function offerClosingWords(string $words): void
    {
        $this->closing_words = $words;
        $this->closing_words_digest = self::digestOf($words);
        $this->delivered_message_id = null;
        $this->save();

        $this->raise(new ClosingWordsOffered($this->id));
    }

    /**
     * The agent stopped again with the same words: they stay private and their text is dropped.
     */
    public function keepClosingWordsPrivate(): void
    {
        $this->closing_words = null;
        $this->save();

        $this->raise(new ClosingWordsKeptPrivate($this->id));
    }

    /**
     * The words went out as this message; their private text is dropped.
     */
    public function markClosingWordsDelivered(string $messageId, string $agentId): void
    {
        $this->closing_words = null;
        $this->delivered_message_id = $messageId;
        $this->save();

        $this->raise(new ClosingWordsDelivered($messageId, $agentId));
    }

    public function finish(string $outcome, CarbonImmutable $at): void
    {
        $this->outcome = $outcome;
        $this->finished_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new DriverTurnFinished($this->id, $outcome));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    private static function digestOf(string $words): string
    {
        return hash('sha256', $words);
    }

    // ----------[ Queries ]----------

    /**
     * The turn of this native prompt in the session's runtime now; none while the runtime has not seen it.
     */
    public static function ofSessionTurn(string $sessionId, string $nativePromptId): self|null
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime === null) {
            return null;
        }

        return self::query()
            ->ofPrompt($runtime->id, $runtime->process_generation, $nativePromptId)
            ->first();
    }

    /**
     * The newest turn of the session's runtime with closing words offered or delivered.
     */
    public static function withClosingWordsOf(string $sessionId): self|null
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime === null) {
            return null;
        }

        return self::query()
            ->ofRuntime($runtime->id)
            ->withClosingWords()
            ->lastStartedFirst()
            ->newestFirst()
            ->lockForUpdate()
            ->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The turn of the native prompt in that process generation of the runtime.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPrompt(Builder $query, string $runtimeId, int $processGeneration, string $nativePromptId): void
    {
        $query->where('agent_runtime_id', $runtimeId)
            ->where('process_generation', $processGeneration)
            ->where('native_prompt_id', $nativePromptId);
    }

    /**
     * The runtime's turns.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRuntime(Builder $query, string $runtimeId): void
    {
        $query->where('agent_runtime_id', $runtimeId);
    }

    /**
     * The turns that hold closing words.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withClosingWords(Builder $query): void
    {
        $query->whereNotNull('closing_words_digest');
    }

    /**
     * The turns started last first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function lastStartedFirst(Builder $query): void
    {
        $query->orderByDesc('started_at');
    }
}
