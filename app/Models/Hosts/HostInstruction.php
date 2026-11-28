<?php

declare(strict_types=1);

namespace App\Models\Hosts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\HostInstructionAnswered;
use App\Events\Connections\HostInstructionClaimed;
use App\Events\Connections\HostInstructionMade;
use App\Events\Connections\HostInstructionOfferedAgain;
use App\Events\Connections\HostInstructionRefused;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Exceptions\HostInstructionStateRefused;
use App\Hosts\HostPayloadJson;
use App\Hosts\Protocol\HostAnswerStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostAnswerPayload;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;
use App\Hosts\Values\HostInstructionBody;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $host_id
 * @property string|null $host_process_id
 * @property string|null $driver_request_id
 * @property string|null $step
 * @property string $idempotency_key
 * @property int $sequence
 * @property HostInstructionType $type
 * @property string $payload
 * @property string $kept_payload
 * @property CarbonImmutable $expires_at
 * @property HostInstructionStatus $status
 * @property HostRefusal|null $refusal
 * @property HostAnswerPayload|null $answer
 * @property CarbonImmutable|null $claimed_at
 * @property CarbonImmutable|null $answered_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class HostInstruction extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * How long a claimed instruction waits for its answer before it is handed out again; the host answers one it carried out
     * from its record and refuses one it was stopped in, so none is carried out twice.
     */
    public const int CLAIM_SECONDS = 10;

    private const int OPEN_ANSWER_GRACE_SECONDS = 600;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => HostInstructionType::class,
            'status' => HostInstructionStatus::class,
            'refusal' => HostRefusal::class,
            'sequence' => 'integer',
            'payload' => 'encrypted',
            'kept_payload' => 'encrypted',
            'answer' => HostAnswerPayload::class,
            'expires_at' => 'immutable_datetime',
            'claimed_at' => 'immutable_datetime',
            'answered_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * An instruction to the host, numbered after the process's last one, or the host's when it is about no process; the
     * caller holds that row's lock.
     */
    public static function create(
        Host $host,
        HostProcess|null $process,
        HostInstructionBody $body,
        CarbonImmutable $expires,
        int $sequence,
    ): self {
        $instruction = new self();
        $instruction->host_id = $host->id;
        $instruction->host_process_id = $process?->id;
        $instruction->driver_request_id = $body->driverRequestId;
        $instruction->step = $body->step;
        $instruction->idempotency_key = $body->idempotencyKey;
        $instruction->sequence = $sequence;
        $instruction->type = $body->type;
        $instruction->payload = HostPayloadJson::encode($body->payload);
        $instruction->kept_payload = HostPayloadJson::encode($body->keptPayload());
        $instruction->expires_at = $expires;
        $instruction->status = HostInstructionStatus::Pending;
        $instruction->saveAndAssert();
        $instruction->raise(new HostInstructionMade($instruction->id, $process?->id, $host->id));

        return $instruction;
    }

    // ----------[ Mutations ]----------

    /**
     * The instruction as a claim hands it to the host, with the signature the host checks it by.
     */
    public function claimedInstruction(string $signature): HostInstructionPayload
    {
        return HostInstructionPayload::from([
            'id' => $this->id,
            'sequence' => $this->sequence,
            'type' => $this->type->value,
            'process_id' => (string) $this->host_process_id,
            'payload' => $this->payload,
            'expires_at' => $this->expires_at->utc()->format('Y-m-d\\TH:i:s\\Z'),
            'signature' => $signature,
        ]);
    }

    /**
     * The host claimed the instruction to carry it out, at the time given.
     */
    public function claim(CarbonImmutable $at): void
    {
        $this->status = HostInstructionStatus::Claimed;
        $this->claimed_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostInstructionClaimed($this->id, $this->host_process_id));
    }

    /**
     * Offers the claimed instruction to the host again, as a claim of its earlier process never reached it or its answer
     * never reached the journal.
     */
    public function offerAgain(): void
    {
        $this->status = HostInstructionStatus::Pending;
        $this->saveAndAssert();
        $this->raise(new HostInstructionOfferedAgain($this->id, $this->host_process_id));
    }

    /**
     * The host carried the instruction out, and the instruction keeps its answer.
     *
     * @throws HostInstructionStateRefused
     */
    public function answer(HostAnswerPayload $answer, CarbonImmutable $at): void
    {
        $this->assertOpen();

        if ($answer->status === HostAnswerStatus::Refused) {
            // A refusal that names no reason is taken as unsafe, the host's own answer to an instruction it does not trust.
            $this->refuse($answer->refusal ?? HostRefusal::Unsafe, $answer->reason, $answer->facts, $at);

            return;
        }

        $this->forgetCarriedSecrets();
        $this->status = HostInstructionStatus::Done;
        $this->answer = $answer;
        $this->answered_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostInstructionAnswered($this->id, $this->host_process_id, $this->type));
    }

    /**
     * The facts of the host's answer, done or refused: a reply, or what a refusal names; none before an answer.
     *
     * @return array<string, mixed>
     */
    public function answerFacts(): array
    {
        return $this->answer->facts ?? [];
    }

    /**
     * The instruction is refused, with the refusal, the words that say why (none when the refusal says it all) and the facts.
     *
     * @param  array<string, mixed>  $facts
     *
     * @throws HostInstructionStateRefused
     */
    public function refuse(HostRefusal $refusal, string|null $reason, array $facts, CarbonImmutable $at): void
    {
        $this->assertOpen();
        $this->forgetCarriedSecrets();
        $this->status = HostInstructionStatus::Refused;
        $this->refusal = $refusal;

        $this->answer = HostAnswerPayload::from([
            'instruction_id' => $this->id,
            'status' => HostAnswerStatus::Refused,
            'refusal' => $refusal,
            'reason' => $reason,
            'facts' => $facts,
        ]);

        $this->answered_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostInstructionRefused($this->id, $this->host_process_id, $this->type, $refusal, $reason));
    }

    /**
     * The instruction was not carried out in time and expires.
     *
     * @throws HostInstructionStateRefused
     */
    public function expire(CarbonImmutable $at): void
    {
        $this->refuse(HostRefusal::Expired, null, [], $at);
    }

    /**
     * An input instruction's bytes and an open instruction's environment, which holds the start's credentials, are needed only
     * until the host answers it: then only what the payload keeps stays, so neither is kept longer than it travels.
     */
    private function forgetCarriedSecrets(): void
    {
        $this->payload = $this->kept_payload;
    }

    // ----------[ Predicates ]----------

    public function isOpen(): bool
    {
        return $this->status->isOpen();
    }

    public function hasExpired(): bool
    {
        return $this->refusal === HostRefusal::Expired;
    }

    public function hasBeenClaimed(): bool
    {
        return $this->claimed_at !== null;
    }

    public function isForAttemptOf(DriverRequest $request): bool
    {
        return $this->driver_request_id === $request->id
            && $this->idempotency_key === "{$request->id}:{$this->step}:{$request->attempt_version}";
    }

    // ----------[ Transformers ]----------

    public function answerDeadline(): CarbonImmutable
    {
        if ($this->type->isOpening() && $this->hasBeenClaimed()) {
            return $this->expires_at->addSeconds(self::OPEN_ANSWER_GRACE_SECONDS);
        }

        return $this->expires_at;
    }

    // ----------[ Asserts ]----------

    /**
     * @throws HostInstructionStateRefused
     */
    private function assertOpen(): void
    {
        if (! $this->isOpen()) {
            throw HostInstructionStateRefused::alreadyEnded($this->id, $this->status);
        }
    }

    // ----------[ Queries ]----------

    /**
     * Whether every instruction placed since the moment has its answer.
     */
    public static function areAllAnsweredSince(CarbonImmutable $since): bool
    {
        return self::query()->placedSince($since)->unanswered()->doesntExist();
    }

    /**
     * Whether the host carried out an allow set placed since the moment, as a host does once it started again.
     */
    public static function hasAllowedSince(Host $host, CarbonImmutable $since): bool
    {
        return self::query()
            ->forHost($host)
            ->ofType(HostInstructionType::AllowImages)
            ->placedSince($since)
            ->withAnyStatus([HostInstructionStatus::Done])
            ->exists();
    }

    /**
     * The instruction, locked until the transaction ends, so one answer is stored at a time.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * Unanswered instructions past their deadline, locked so a claim beside this sweep skips them.
     *
     * @return list<self>
     */
    public static function findExpiredAt(CarbonImmutable $now, int $limit): array
    {
        $instructions = self::query()
            ->withAnyStatus([HostInstructionStatus::Pending, HostInstructionStatus::Claimed])
            ->answerExpiredAt($now)
            ->lock('for update skip locked')
            ->limit($limit)
            ->get();

        return array_values($instructions->all());
    }

    /**
     * The open instructions of a process, locked.
     *
     * @return list<self>
     */
    public static function findOpenOf(string $processId): array
    {
        $instructions = self::query()
            ->ofProcess($processId)
            ->withAnyStatus([HostInstructionStatus::Pending, HostInstructionStatus::Claimed])
            ->lockForUpdate()
            ->get();

        return array_values($instructions->all());
    }

    /**
     * The instructions a host claimed and has not answered, locked, as its start reads them.
     *
     * @return list<self>
     */
    public static function findClaimedOf(Host $host): array
    {
        $instructions = self::query()
            ->forHost($host)
            ->withAnyStatus([HostInstructionStatus::Claimed])
            ->lockForUpdate()
            ->get();

        return array_values($instructions->all());
    }

    /**
     * The host's allow set the host has not answered yet, if one is out: a host takes one allow set at a time.
     */
    public static function findOutstandingAllowOf(Host $host): self|null
    {
        return self::query()->forHost($host)->ofType(HostInstructionType::AllowImages)->unanswered()->first();
    }

    /**
     * The instruction made under the key before, so a repeated step makes no second one.
     */
    public static function findWithKey(string $idempotencyKey): self|null
    {
        return self::query()->withIdempotencyKey($idempotencyKey)->first();
    }

    /**
     * The seconds until the first instruction the host claimed and has not answered may be handed out again, at least one;
     * null when it holds none, so a claim that waits wakes in time to hand it out.
     */
    public static function resolveSecondsUntilRetakeable(Host $host, CarbonImmutable $now): int|null
    {
        $oldest = self::query()
            ->forHost($host)
            ->withAnyStatus([HostInstructionStatus::Claimed])
            ->inTimeAt($now)
            ->min('claimed_at');

        if ($oldest === null) {
            return null;
        }

        $retakeable = CarbonImmutable::parse((string) $oldest)->addSeconds(self::CLAIM_SECONDS);

        return max(1, (int) ceil($now->diffInSeconds($retakeable, false)));
    }

    /**
     * The instructions the host may take now, by their number: those waiting and in time, and those claimed and unanswered
     * too long, locked so a claim beside this one skips them. No container opens before the host answered its
     * allow_images instruction, since the host runs the two side by side and the open would find the image not yet allowed.
     *
     * @return list<self>
     */
    public static function findClaimable(Host $host, CarbonImmutable $now, int $limit): array
    {
        $isAllowingImages = self::query()
            ->forHost($host)
            ->ofType(HostInstructionType::AllowImages)
            ->withAnyStatus([HostInstructionStatus::Pending, HostInstructionStatus::Claimed])
            ->exists();

        $instructions = self::query()
            ->forHost($host)
            ->takeableAt($now)
            ->holdingContainerOpensWhile($isAllowingImages)
            ->bySequence()
            ->lock('for update skip locked')
            ->limit($limit)
            ->get();

        return array_values($instructions->all());
    }

    /**
     * The instructions of a driver request that were made and not refused, waiting, handed out or carried out, by their
     * number: where a new worker takes the request up without ordering a step twice.
     *
     * @return list<self>
     */
    public static function findOrderedFor(DriverRequest $request): array
    {
        $instructions = self::query()
            ->ofDriverRequest($request)
            ->withAnyStatus([
                HostInstructionStatus::Pending,
                HostInstructionStatus::Claimed,
                HostInstructionStatus::Done,
            ])
            ->bySequence()
            ->get();

        return array_values($instructions->all());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function placedSince(Builder $query, CarbonImmutable $since): void
    {
        $query->where('created_at', '>=', $since);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unanswered(Builder $query): void
    {
        $query->whereNull('answered_at');
    }

    /**
     * @param  Builder<self>  $query
     * @param  list<HostInstructionStatus>  $statuses
     */
    #[Scope]
    protected function withAnyStatus(Builder $query, array $statuses): void
    {
        $query->whereIn('status', $statuses);
    }

    /**
     * Claimed openings have a separate time to answer. Their claim still uses the original expiry.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function answerExpiredAt(Builder $query, CarbonImmutable $now): void
    {
        $openings = array_filter(HostInstructionType::cases(), fn (HostInstructionType $type) => $type->isOpening());

        $query->where('expires_at', '<=', $now)->where(fn (Builder $expired) => $expired
            ->whereNull('claimed_at')
            ->orWhereNotIn('type', $openings)
            ->orWhere('expires_at', '<=', $now->subSeconds(self::OPEN_ANSWER_GRACE_SECONDS)));
    }

    /**
     * The instructions whose expiry is still to come at the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inTimeAt(Builder $query, CarbonImmutable $now): void
    {
        $query->where('expires_at', '>', $now);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProcess(Builder $query, string $processId): void
    {
        $query->where('host_process_id', $processId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withIdempotencyKey(Builder $query, string $idempotencyKey): void
    {
        $query->where('idempotency_key', $idempotencyKey);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofType(Builder $query, HostInstructionType $type): void
    {
        $query->where('type', $type);
    }

    /**
     * Leaves out every container open while the host has not yet answered its allow_images instruction.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function holdingContainerOpensWhile(Builder $query, bool $isAllowingImages): void
    {
        if ($isAllowingImages) {
            $query->where('type', '!=', HostInstructionType::OpenContainer);
        }
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function bySequence(Builder $query): void
    {
        $query->orderBy('sequence');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forHost(Builder $query, Host $host): void
    {
        $query->where('host_id', $host->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriverRequest(Builder $query, DriverRequest $request): void
    {
        $query->where('driver_request_id', $request->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function takeableAt(Builder $query, CarbonImmutable $now): void
    {
        $query->where('expires_at', '>', $now)->where(
            fn (Builder $takeable) => $takeable->where('status', HostInstructionStatus::Pending)->orWhere(
                fn (Builder $unanswered) => $unanswered->where('status', HostInstructionStatus::Claimed)
                    ->where('claimed_at', '<', $now->subSeconds(self::CLAIM_SECONDS)),
            ),
        );
    }

    /**
     * The instructions the host answered done before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function answeredDoneBefore(Builder $query, CarbonImmutable $before): void
    {
        $query->where('status', HostInstructionStatus::Done)->where('answered_at', '<', $before);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function answeredBefore(Builder $query, CarbonImmutable $before): void
    {
        $query->whereIn('status', [HostInstructionStatus::Done, HostInstructionStatus::Refused])
            ->where('answered_at', '<', $before);
    }

    /**
     * Only the id of each instruction, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ids(Builder $query): void
    {
        $query->select('id');
    }
}
