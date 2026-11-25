<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Bus\TargetedCommand;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Data\Receipts\ReceiptResultData;
use App\Enums\CommandRules\ReceiptState;
use App\Enums\Engine\RefusalCode;
use App\Events\Engine\CommandReceiptCompleted;
use App\Events\Engine\CommandReceiptRefused;
use App\Exceptions\RefusalReplayed;
use App\Exceptions\RequestKeyExpired;
use App\Models\Support\Accessor;
use App\Support\CommandName;
use App\Support\Operation;
use App\Support\PlainValue;
use App\Support\ReceiptCaller;
use App\Support\ReceiptCallers;
use App\Support\ReceiptRetention;
use App\Values\RecoveryCall;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $author_type
 * @property string $author_id
 * @property string|null $session_id
 * @property int $contract_major
 * @property string $request_key
 * @property string $command
 * @property string $fingerprint
 * @property ReceiptState $state
 * @property ReceiptResultData|null $result
 * @property string|null $refusal_code
 * @property string|null $refusal_message
 * @property RecoveryCall|null $refusal_recovery
 * @property CarbonImmutable $answers_until
 * @property CarbonImmutable|null $refuses_until
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $target
 * @property-read mixed $to_operation
 *
 * @mixin \Eloquent
 */
final class CommandReceipt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The major version of the agent contract the keys belong to; a new major starts a new key space.
     */
    public const int CONTRACT_MAJOR = 1;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => ReceiptState::class,
            'result' => ReceiptResultData::class,
            'refusal_recovery' => RecoveryCall::class,
            'contract_major' => 'integer',
            'answers_until' => 'immutable_datetime',
            'refuses_until' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::addGlobalScope(
            'caller',
            static fn (Builder $query) => Container::getInstance()->make(
                ReceiptCallers::class,
            )->current()->limitReadable($query),
        );
    }

    // ----------[ Constructors ]----------

    /**
     * Takes the key for a command that is about to run.
     */
    public static function create(
        ReceiptCaller $caller,
        string $requestKey,
        object $command,
        ReceiptRetention $retention,
    ): self {
        $now = CarbonImmutable::now();

        $receipt = new self();
        $receipt->author_type = $caller->actor->type;
        $receipt->author_id = $caller->actor->id;
        $receipt->session_id = $caller->sessionId;
        $receipt->contract_major = self::CONTRACT_MAJOR;
        $receipt->request_key = $requestKey;
        $receipt->command = $command::class;
        $receipt->fingerprint = PlainValue::fingerprintOf($command);
        $receipt->target = $command instanceof TargetedCommand ? $command->receiptTarget() : null;
        $receipt->answers_until = $retention->answersUntil($now);
        $receipt->refuses_until = $retention->refusesUntil($now);
        $receipt->state = ReceiptState::Taken;
        $receipt->assertSaved($receipt->save());

        return $receipt;
    }

    // ----------[ Mutations ]----------

    public function complete(mixed $reply): void
    {
        $this->state = ReceiptState::Completed;
        $this->result = ReceiptResultData::of($reply);
        $this->assertSaved($this->save());
        $this->raise(new CommandReceiptCompleted($this->id));
    }

    /**
     * The key this write took in a transaction it joined is marked refused, unless it already holds a completed
     * result: a refusal now, such as revoked rights on a replay, never replaces that.
     */
    public function refuse(RefusalCode $code, string $message, RecoveryCall|null $recovery): void
    {
        if ($this->state === ReceiptState::Completed) {
            return;
        }

        $this->state = ReceiptState::Refused;
        $this->refusal_code = $code->value;
        $this->refusal_message = $message;
        $this->refusal_recovery = $recovery;
        $this->assertSaved($this->save());
        $this->raise(new CommandReceiptRefused($this->id, $code));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether this receipt's key may answer the command: the key expired and is used again, or it holds this command.
     */
    public function admitsCommand(object $command): bool
    {
        return $this->isExpired() || $this->isFor($command);
    }

    public function isFor(object $command): bool
    {
        return hash_equals($this->fingerprint, PlainValue::fingerprintOf($command));
    }

    /**
     * Whether the receipt no longer answers a repeat: expired, or past its retention before the prune expired it.
     */
    public function isForTarget(string $target): bool
    {
        return $this->target !== null && hash_equals($this->target, $target);
    }

    public function isExpired(): bool
    {
        return $this->state === ReceiptState::Expired || $this->answers_until->isPast();
    }

    // ----------[ Transformers ]----------

    /**
     * The answer the write got the first time: its result again, or its refusal thrown again.
     *
     * @throws RefusalReplayed
     * @throws RequestKeyExpired
     */
    public function replay(): mixed
    {
        $this->assertReplayable();

        return $this->result->reply();
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<Operation, never>
     */
    protected function toOperation(): Attribute
    {
        return Accessor::get(fn () => new Operation(
            $this->request_key,
            CommandName::of($this->command),
            $this->state,
            $this->result?->value,
            $this->refusal_code === null ? null : RefusalCode::from($this->refusal_code),
            $this->refusal_message,
            CarbonImmutable::instance($this->created_at ?? CarbonImmutable::now()),
        ));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a replay of an expired key, and replays a refusal as the refusal it recorded.
     *
     * @throws RequestKeyExpired
     * @throws RefusalReplayed
     */
    private function assertReplayable(): void
    {
        if ($this->isExpired()) {
            throw RequestKeyExpired::for($this->request_key);
        }

        if ($this->state === ReceiptState::Refused) {
            throw RefusalReplayed::of(
                RefusalCode::from((string) $this->refusal_code),
                (string) $this->refusal_message,
                $this->refusal_recovery,
            );
        }
    }

    // ----------[ Internals ]----------

    /**
     * The request keys of those receipts the current caller may read back, keyed by receipt id; another caller's
     * receipts are left out.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function readableKeysOf(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return self::query()->whereKey($ids)->pluck('request_key', 'id')->all();
    }

    // ----------[ Queries ]----------

    /**
     * The caller's receipt of the command under the key, read without a lock, if it has one.
     */
    public static function findReadFor(ReceiptCaller $caller, string $command, string $requestKey): self|null
    {
        $query = self::query()->withoutGlobalScope('caller');
        $caller->limit($query);

        return $query->ofRequest($command, $requestKey)->first();
    }

    /**
     * The caller's receipt of the command under the key, locked for this transaction, if it has one.
     *
     * @param  class-string  $command
     */
    public static function findLockedFor(ReceiptCaller $caller, string $command, string $requestKey): self|null
    {
        $query = self::query()->withoutGlobalScope('caller');
        $caller->limit($query);

        return $query->ofRequest($command, $requestKey)->lockForUpdate()->first();
    }

    // ----------[ Scopes ]----------

    /**
     * Receipts of every caller whose answer is kept no longer and that are not yet expired, for the prune.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pastRetention(Builder $query, CarbonImmutable $now): void
    {
        $query->withoutGlobalScope('caller')->where('answers_until', '<', $now)->whereNot(
            'state',
            ReceiptState::Expired->value,
        );
    }

    /**
     * Receipts of every caller whose key is refused no longer, for the prune.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pastRefusalWindow(Builder $query, CarbonImmutable $now): void
    {
        // An empty refuses_until keeps the key refused for good, so its tombstone is never pruned.
        $query->withoutGlobalScope('caller')->whereNotNull('refuses_until')->where('refuses_until', '<', $now);
    }

    /**
     * The receipt of the command's request under this contract.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRequest(Builder $query, string $command, string $requestKey): void
    {
        $query->where('command', $command)
            ->where('contract_major', self::CONTRACT_MAJOR)
            ->where('request_key', $requestKey);
    }

    /**
     * The rows of the given request key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRequestKey(Builder $query, string $requestKey): void
    {
        $query->where('request_key', $requestKey);
    }

    /**
     * The rows of the given contract major.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withContractMajor(Builder $query, int $major): void
    {
        $query->where('contract_major', $major);
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
