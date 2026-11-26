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
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $process_generation
 * @property string $native_prompt_id
 * @property string|null $observed_model
 * @property string|null $observed_effort
 * @property string|null $outcome
 * @property CarbonImmutable $started_at
 * @property CarbonImmutable|null $finished_at
 * @property string|null $closing_words
 * @property string|null $closing_words_digest
 * @property string|null $delivered_message_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read AgentRuntime|null $runtime
 *
 * @mixin \Eloquent
 */
final class DriverTurn extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
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
        $existing = self::findOfPrompt($runtimeId, $processGeneration, $nativePromptId);

        if ($existing !== null) {
            return $existing;
        }

        $driverTurn = new self();
        $driverTurn->agent_runtime_id = $runtimeId;
        $driverTurn->process_generation = $processGeneration;
        $driverTurn->native_prompt_id = $nativePromptId;
        $driverTurn->started_at = $startedAt;
        $driverTurn->saveAndAssert();

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
        $this->saveAndAssert();
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
    public static function findForSessionTurn(string $sessionId, string $nativePromptId): self|null
    {
        $runtime = AgentRuntime::findForSession($sessionId);

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
    public static function findWithClosingWordsOf(string $sessionId): self|null
    {
        $runtime = AgentRuntime::findForSession($sessionId);

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

    /**
     * The turn of this prompt in the process generation; none before it.
     */
    public static function findOfPrompt(string $runtimeId, int $processGeneration, string $nativePromptId): self|null
    {
        return self::query()->ofPrompt($runtimeId, $processGeneration, $nativePromptId)->first();
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
