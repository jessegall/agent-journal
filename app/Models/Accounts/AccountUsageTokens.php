<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\AccountUsageChanged;
use App\Models\Concerns\KeepsNewestReading;
use App\Models\Concerns\RemovedWithAccount;
use App\Models\Support\AccountOwnerScope;
use App\Values\ThreadTokens;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The latest token count a driver reported for one thread on a saved account in one sign-in generation: the
 * thread's total so far, the reported parts of it and the last turn's total. A newer count replaces it, never adds.
 *
 * @property string $id
 * @property string $account_id
 * @property int $sign_in_generation
 * @property string $thread_id
 * @property int $total
 * @property int|null $input
 * @property int|null $cached_input
 * @property int|null $output
 * @property int|null $reasoning_output
 * @property int|null $last_turn_total
 * @property CarbonImmutable $observed_at
 * @property string $source_id
 * @property int $source_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['account_id', 'sign_in_generation', 'thread_id'])]
final class AccountUsageTokens extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use KeepsNewestReading;
    use Linkable;
    use RaisesEvents;
    use RemovedWithAccount;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sign_in_generation' => 'integer',
            'total' => 'integer',
            'input' => 'integer',
            'cached_input' => 'integer',
            'output' => 'integer',
            'reasoning_output' => 'integer',
            'last_turn_total' => 'integer',
            'observed_at' => 'immutable_datetime',
            'source_order' => 'integer',
        ];
    }

    /**
     * A new count of the thread on the account in the generation.
     */
    public static function create(Account $account, int $generation, ThreadTokens $tokens): void
    {
        $snapshot = new self([
            'account_id' => $account->id,
            'sign_in_generation' => $generation,
            'thread_id' => $tokens->threadId,
        ]);

        $snapshot->fillWith($tokens);
        $snapshot->assertSaved($snapshot->save());
        $snapshot->raise(new AccountUsageChanged($account->account_protocol, $account->id));
    }

    // ----------[ Queries ]----------

    /**
     * The thread's count on the account in the generation, locked; none before its first count.
     */
    public static function lockedFor(Account $account, int $generation, ThreadTokens $tokens): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('account_id', $account->id)
            ->where('sign_in_generation', $generation)
            ->where('thread_id', $tokens->threadId)
            ->lockForUpdate()
            ->first();
    }

    /**
     * The newest thread count of each account in its current sign-in generation, by account id; an account with
     * none is left out.
     *
     * @param  list<Account>  $accounts
     * @return array<string, self>
     */
    public static function newestOf(array $accounts): array
    {
        if ($accounts === []) {
            return [];
        }

        $snapshots = self::query()
            ->inCurrentGenerationOf($accounts)
            ->distinct('account_id')
            ->orderBy('account_id')
            ->orderByDesc('observed_at')
            ->orderByDesc('source_order')
            ->orderByDesc('source_id')
            ->readExactly(count($accounts))
            ->get();

        $newest = [];

        foreach ($snapshots as $snapshot) {
            $newest[$snapshot->account_id] = $snapshot;
        }

        return $newest;
    }

    // ----------[ Mutations ]----------

    /**
     * Replaces the thread's count with a newer one; totals are the driver's own, so they are never added up.
     */
    public function replaceWith(string $driver, ThreadTokens $tokens): void
    {
        $this->fillWith($tokens);
        $this->saveReading($driver);
    }

    // ----------[ Internals ]----------

    private function fillWith(ThreadTokens $tokens): void
    {
        $this->total = $tokens->total;
        $this->input = $tokens->input;
        $this->cached_input = $tokens->cachedInput;
        $this->output = $tokens->output;
        $this->reasoning_output = $tokens->reasoningOutput;
        $this->last_turn_total = $tokens->lastTurnTotal;
        $this->observed_at = $tokens->source->observedTime();
        $this->source_id = $tokens->source->id;
        $this->source_order = $tokens->source->order;
    }
}
