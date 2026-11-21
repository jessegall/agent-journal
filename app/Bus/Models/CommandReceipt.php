<?php

declare(strict_types=1);

namespace App\Bus\Models;

use App\Bus\Enums\ReceiptState;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\RefusalReplayed;
use App\Bus\Exceptions\RequestKeyExpired;
use App\Bus\Support\Operation;
use App\Bus\Support\PlainValue;
use App\Bus\Support\ReceiptCaller;
use App\Bus\Support\ReceiptCallers;
use App\Bus\Support\ReceiptRetention;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One receipted write of a caller under its request key: the command and its fingerprint, and the result it returned
 * or the refusal it got, so a retry with the same key gets the same answer without running it again. Keys are kept
 * per caller and command (an agent's per session); past its retention a receipt is expired, its answer cleared and
 * its key refused until the receipt is pruned. Every query sees only the caller's receipts; the prune reads wider
 * through its named queries.
 *
 * @property string $id
 * @property string $author_type
 * @property string $author_id
 * @property string|null $session_id
 * @property int $contract_major
 * @property string $request_key
 * @property string $command
 * @property string $fingerprint
 * @property ReceiptState $state
 * @property array{value: mixed, php: string}|null $result
 * @property string|null $refusal_code
 * @property string|null $refusal_message
 * @property array<string, mixed>|null $refusal_details
 * @property CarbonImmutable $answers_until
 * @property CarbonImmutable|null $refuses_until
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(
    [
        'author_type',
        'author_id',
        'session_id',
        'contract_major',
        'request_key',
        'command',
        'fingerprint',
        'state',
        'result',
        'refusal_code',
        'refusal_message',
        'refusal_details',
        'answers_until',
        'refuses_until',
    ],
)]
final class CommandReceipt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.command-receipt';

    /**
     * The major version of the agent contract the keys belong to; a new major starts a new key space.
     */
    public const int CONTRACT_MAJOR = 1;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => ReceiptState::class,
            'result' => 'array',
            'refusal_details' => 'array',
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

    /**
     * Takes the key for a command that is about to run.
     */
    public static function create(
        ReceiptCaller $caller,
        string $requestKey,
        object $command,
        ReceiptRetention $retention,
    ): self {
        return self::query()->create(
            [...self::keyColumns($caller, $requestKey, $command, $retention), 'state' => ReceiptState::Taken],
        );
    }

    /**
     * A new receipt of the refusal a write got after its transaction rolled back.
     *
     * @param  array<string, mixed>  $details
     */
    public static function createRefused(
        ReceiptCaller $caller,
        string $requestKey,
        object $command,
        ReceiptRetention $retention,
        RefusalCode $code,
        string $message,
        array $details = [],
    ): self {
        return self::query()->create([
            ...self::keyColumns($caller, $requestKey, $command, $retention),
            ...self::refusalColumns($code, $message, $details),
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The caller's receipt of the command under the key, locked for this transaction, if it has one.
     *
     * @param  class-string  $command
     */
    public static function lockedFor(ReceiptCaller $caller, string $command, string $requestKey): self|null
    {
        $query = self::query()->withoutGlobalScope('caller');
        $caller->limit($query);

        return $query->where('command', $command)->where(
            'contract_major',
            self::CONTRACT_MAJOR,
        )->where('request_key', $requestKey)->lockForUpdate()->first();
    }

    // ----------[ Mutations ]----------

    public function complete(mixed $reply): void
    {
        $this->state = ReceiptState::Completed;
        $this->result = ['value' => PlainValue::of($reply), 'php' => base64_encode(serialize($reply))];
        $this->save();
    }

    /**
     * The key this write took in a transaction it joined is marked refused, unless it already holds a completed
     * result: a refusal now, such as revoked rights on a replay, never replaces that.
     *
     * @param  array<string, mixed>  $details
     */
    public function refuse(RefusalCode $code, string $message, array $details = []): void
    {
        if ($this->state === ReceiptState::Completed) {
            return;
        }

        $this->fill(self::refusalColumns($code, $message, $details))->save();
    }

    // ----------[ Answers ]----------

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
    public function isExpired(): bool
    {
        return $this->state === ReceiptState::Expired || $this->answers_until->isPast();
    }

    /**
     * The answer the write got the first time: its result again, or its refusal thrown again.
     *
     * @throws RefusalReplayed
     * @throws RequestKeyExpired
     */
    public function replay(): mixed
    {
        if ($this->isExpired()) {
            throw RequestKeyExpired::for($this->request_key);
        }

        if ($this->state === ReceiptState::Refused) {
            throw RefusalReplayed::of(
                RefusalCode::from((string) $this->refusal_code),
                (string) $this->refusal_message,
                $this->refusal_details ?? [],
            );
        }

        return unserialize(base64_decode((string) $this->result['php']));
    }

    public function toOperation(): Operation
    {
        return new Operation(
            $this->request_key,
            class_basename($this->command),
            $this->state,
            $this->result['value'] ?? null,
            $this->refusal_code === null ? null : RefusalCode::from($this->refusal_code),
            $this->refusal_message,
            CarbonImmutable::instance($this->created_at ?? CarbonImmutable::now()),
        );
    }

    // ----------[ Internals ]----------

    /**
     * @param  array<string, mixed>  $details
     * @return array<string, mixed>
     */
    private static function refusalColumns(RefusalCode $code, string $message, array $details): array
    {
        return [
            'state' => ReceiptState::Refused,
            'refusal_code' => $code->value,
            'refusal_message' => $message,
            'refusal_details' => $details,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function keyColumns(
        ReceiptCaller $caller,
        string $requestKey,
        object $command,
        ReceiptRetention $retention,
    ): array {
        $now = CarbonImmutable::now();

        return [
            ...$caller->columns(),
            'contract_major' => self::CONTRACT_MAJOR,
            'request_key' => $requestKey,
            'command' => $command::class,
            'fingerprint' => PlainValue::fingerprintOf($command),
            'answers_until' => $retention->answersUntil($now),
            'refuses_until' => $retention->refusesUntil($now),
        ];
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
    protected function pastTombstone(Builder $query, CarbonImmutable $now): void
    {
        // An empty refuses_until keeps the key refused for good, so its tombstone is never pruned.
        $query->withoutGlobalScope('caller')->whereNotNull('refuses_until')->where('refuses_until', '<', $now);
    }
}
