<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sessions\DriverTurnFinished;
use App\Models\Agents\AgentRuntime;
use App\Events\Messages\ClosingWordsDelivered;
use App\Events\Sessions\ClosingWordsKeptPrivate;
use App\Events\Sessions\ClosingWordsOffered;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One native turn of a runtime's driver: keyed by its process generation and the driver's own prompt id
 * (Claude Code prompt_id, Codex turn_id), with the settings it ran with and how it ended.
 *
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
 */
#[Fillable(
    ['agent_runtime_id', 'process_generation', 'native_prompt_id', 'observed_model', 'observed_effort', 'started_at'],
)]
final class DriverTurn extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

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

    /**
     * The turn of this native prompt in this process generation, recorded the first time it is seen; a repeated
     * report finds the same turn. The caller's transaction holds the runtime's lock, so two reports never race.
     */
    public static function recordStart(
        string $runtimeId,
        int $processGeneration,
        string $nativePromptId,
        CarbonImmutable $startedAt,
    ): self {
        $key = [
            'agent_runtime_id' => $runtimeId,
            'process_generation' => $processGeneration,
            'native_prompt_id' => $nativePromptId,
        ];

        return self::query()->where($key)->first() ?? self::query()->create([...$key, 'started_at' => $startedAt]);
    }

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
            ->where('agent_runtime_id', $runtime->id)
            ->where('process_generation', $runtime->process_generation)
            ->where('native_prompt_id', $nativePromptId)
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
            ->where('agent_runtime_id', $runtime->id)
            ->whereNotNull('closing_words_digest')
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->lockForUpdate()
            ->first();
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
}
