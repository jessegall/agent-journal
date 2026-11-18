<?php

declare(strict_types=1);

namespace App\Bus\Models;

use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CallerSession;
use App\Bus\Enums\ReceiptState;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\RefusalReplayed;
use App\Bus\Support\Operation;
use App\Bus\Support\PlainValue;
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
 * One receipted write of an agent session under its request key: the command and its fingerprint, and the result it
 * returned or the refusal it got, so a retry with the same key gets the same answer without running it again. Every
 * query sees only the calling session's receipts; the prune reads wider through its named query.
 *
 * @property string $id
 * @property string $session_id
 * @property int $contract_major
 * @property string $request_key
 * @property string $command
 * @property string $fingerprint
 * @property ReceiptState $state
 * @property array{value: mixed, php: string}|null $result
 * @property string|null $refusal_code
 * @property string|null $refusal_message
 * @property string $author_type
 * @property string $author_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['session_id', 'contract_major', 'request_key', 'command', 'fingerprint', 'state', 'result', 'refusal_code', 'refusal_message', 'author_type', 'author_id'])]
final class CommandReceipt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    public const string LINK_TYPE = 'core.command-receipt';

    /**
     * The major version of the agent contract the keys belong to; a new major starts a new key space.
     */
    public const int CONTRACT_MAJOR = 1;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['state' => ReceiptState::class, 'result' => 'array', 'contract_major' => 'integer'];
    }

    protected static function booted(): void
    {
        self::addGlobalScope('caller-session', static fn (Builder $query) => $query->where(
            $query->qualifyColumn('session_id'),
            Container::getInstance()->make(CallerSession::class)->sessionId(),
        ));
    }

    /**
     * The caller's receipt under the key, locked for this transaction, if it has one.
     */
    public static function lockedFor(string $requestKey): self|null
    {
        return self::query()->where('contract_major', self::CONTRACT_MAJOR)->where('request_key', $requestKey)->lockForUpdate()->first();
    }

    /**
     * Takes the key for a command that is about to run.
     */
    public static function take(string $sessionId, string $requestKey, object $command, ActorContext $author): self
    {
        return self::query()->create([
            'session_id' => $sessionId,
            'contract_major' => self::CONTRACT_MAJOR,
            'request_key' => $requestKey,
            'command' => $command::class,
            'fingerprint' => PlainValue::fingerprintOf($command),
            'state' => ReceiptState::Taken,
            'author_type' => $author->type->value,
            'author_id' => $author->id,
        ]);
    }

    /**
     * Stores the refusal a write got, in one statement after its transaction rolled back.
     */
    public static function recordRefusal(string $sessionId, string $requestKey, object $command, ActorContext $author, RefusalCode $code, string $message): void
    {
        self::query()->create([
            'session_id' => $sessionId,
            'contract_major' => self::CONTRACT_MAJOR,
            'request_key' => $requestKey,
            'command' => $command::class,
            'fingerprint' => PlainValue::fingerprintOf($command),
            'state' => ReceiptState::Refused,
            'refusal_code' => $code->value,
            'refusal_message' => $message,
            'author_type' => $author->type->value,
            'author_id' => $author->id,
        ]);
    }

    public function complete(mixed $result): void
    {
        $this->state = ReceiptState::Completed;
        $this->result = ['value' => PlainValue::of($result), 'php' => base64_encode(serialize($result))];
        $this->save();
    }

    public function isFor(object $command): bool
    {
        return hash_equals($this->fingerprint, PlainValue::fingerprintOf($command));
    }

    /**
     * The answer the write got the first time: its result again, or its refusal thrown again.
     *
     * @throws RefusalReplayed
     */
    public function replay(): mixed
    {
        if ($this->state === ReceiptState::Refused) {
            throw RefusalReplayed::of(RefusalCode::from((string) $this->refusal_code), (string) $this->refusal_message);
        }

        return unserialize(base64_decode((string) ($this->result['php'] ?? '')));
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

    /**
     * Receipts older than the cutoff, of every session, for the operator's prune.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThan(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->withoutGlobalScope('caller-session')->where('created_at', '<', $cutoff);
    }
}
