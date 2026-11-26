<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Accounts\AccountUsageChanged;
use App\Models\Concerns\KeepsNewestReading;
use App\Models\Concerns\OfSignIn;
use App\Models\Concerns\RemovedWithAccount;
use App\Models\Support\AccountOwnerScope;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Values\ThreadTokens;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
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
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class AccountUsageTokens extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use KeepsNewestReading;
    use Linkable;
    use OfSignIn;
    use RaisesEvents;
    use RemovedWithAccount;

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

    // ----------[ Constructors ]----------

    /**
     * A new count of the thread on the account in the generation.
     */
    public static function create(Account $account, int $generation, ThreadTokens $tokens): void
    {
        $snapshot = new self();
        $snapshot->account_id = $account->id;
        $snapshot->sign_in_generation = $generation;
        $snapshot->thread_id = $tokens->threadId;

        $snapshot->fillWith($tokens);
        $snapshot->saveAndAssert();
        $snapshot->raise(new AccountUsageChanged($account->account_protocol, $account->id));
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

    // ----------[ Queries ]----------

    /**
     * The thread's count on the account in the generation, locked; none before its first count.
     */
    public static function findLockedFor(Account $account, int $generation, ThreadTokens $tokens): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofSignIn($account, $generation)
            ->ofThread($tokens->threadId)
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
    public static function findNewestOf(array $accounts): array
    {
        if ($accounts === []) {
            return [];
        }

        $snapshots = self::query()
            ->inCurrentGenerationOf($accounts)
            ->newestPerAccount()
            ->readExactly(count($accounts))
            ->get();

        $newest = [];

        foreach ($snapshots as $snapshot) {
            $newest[$snapshot->account_id] = $snapshot;
        }

        return $newest;
    }

    // ----------[ Scopes ]----------

    /**
     * The thread's tokens.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofThread(Builder $query, string $threadId): void
    {
        $query->where('thread_id', $threadId);
    }

    /**
     * Each account's newest reading only.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestPerAccount(Builder $query): void
    {
        $query->distinct('account_id')
            ->orderBy('account_id')
            ->orderByDesc('observed_at')
            ->orderByDesc('source_order')
            ->orderByDesc('source_id');
    }
}
